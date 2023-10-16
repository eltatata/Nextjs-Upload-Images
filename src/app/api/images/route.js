import fs from 'fs';
import path from "path";
import { NextResponse } from "next/server";
import Image from '@/models/Image';
import { connectionDB } from '@/utils/db';
import { nanoid } from 'nanoid';

// Funcion para subir imagenes
export async function POST(req) {
    connectionDB();

    try {
        // Obtiene los datos de formulario enviados con la solicitud
        const data = await req.formData();

        const file = data.get('image'); // Obtiene el archivo 'image' del formulario
        const name = data.get('name');
        const description = data.get('description');
        // console.log(file, name, description);

        // verficar si exite el archivo
        if (!file) throw new Error('No se cargo ningun archivo');
        // verficar si envio el nombre
        if (!name) throw new Error('Falta el nombre de la imagen');
        // Verificar si el archivo es una imagen jpeg, jpg, png o gif
        if (!file.name.match(/\.(jpeg|jpg|png|gif)$/i)) {
            throw new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif).');
        }

        // crear un identificador para el archivo imagen
        const fileID = `${nanoid(8)}.${file.name.split(".")[1]}`
        // Construir la ruta donde se guardará el archivo
        const uploadDir = path.join(process.cwd(), 'public/upload');
        const dirFile = path.join(uploadDir, fileID);

        // Verificar si el directorio de carga existe; si no, créalo
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        // Lee el contenido del archivo y lo almacena en un formato manejable
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        // Escribe el contenido del archivo en la ubicación especificada
        fs.writeFileSync(dirFile, buffer);

        const image = new Image({
            name: name,
            originalName: file.name,
            description: description,
            route: `/upload/${fileID}`,
        })
        await image.save();

        console.log(image);

        // Responde con un mensaje JSON que indica que la imagen se está subiendo
        return NextResponse.json({
            msg: "Imagen subida"
        });
    } catch (error) {
        // Si ocurre un error, responde con un mensaje JSON de error y un código de estado 404
        return NextResponse.json({ err: error.message }, { status: 500 });
    };
};

// Funcion para obtener las imagenes
export async function GET(params) {
    connectionDB();

    try {
        const images = await Image.find().lean();

        console.log(images);

        return NextResponse.json({
            images
        });
    } catch (error) {
        return NextResponse.json({ err: error.message }, { status: 404 });

    };
};