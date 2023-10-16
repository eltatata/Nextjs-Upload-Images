import fs from 'fs';
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { NextResponse } from "next/server";
import Image from '@/models/Image';
import { connectionDB } from '@/utils/db';

// Obtiene el directorio actual usando la URL del módulo
const __dirname = dirname(fileURLToPath(import.meta.url));

// Funcion para subir imagenes
export async function POST(req) {
    connectionDB();

    try {
        // Obtiene los datos de formulario enviados con la solicitud
        const data = await req.formData();

        const file = data.get('image'); // Obtiene el archivo 'image' del formulario
        const name = `${data.get('name')}.${file.name.split(".")[1]}`;
        const description = data.get('description');
        // console.log(file, name, description);

        // saber si una imagen ya creada con el mismo nombre
        if (await Image.findOne({ name: name })) throw new Error("Ya existe una imagen con ese nombre");

        // verficar si exite el archivo
        if (!file) throw new Error('No se cargo ningun archivo');
        // verficar si envio el nombre
        if (!name) throw new Error('Falta el nombre de la imagen');
        // Verificar si el archivo es una imagen jpeg, jpg, png o gif
        if (!file.name.match(/\.(jpeg|jpg|png|gif)$/i)) {
            throw new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif).');
        }

        // Lee el contenido del archivo y lo almacena en un formato manejable
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Construye la ruta donde se guardará el archivo
        const dirFile = path.join(__dirname, '../../../../public/upload', name);
        // console.log(ruta);

        // Escribe el contenido del archivo en la ubicación especificada
        fs.writeFileSync(dirFile, buffer);

        const image = new Image({
            name: name,
            originalName: file.name,
            description: description,
            route: `/upload/${name}`,
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