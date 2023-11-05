import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from "next/server";
import Image from '@/models/Image';
import { connectionDB } from '@/utils/db';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

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

        // Lee el contenido del archivo y lo almacena en un formato manejable
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        /* 
            se paso de guardar la imagenes en el mismo servidor a cloudinary
            ya que vercel no permite la escritura de archivos
        */

        // pasando el "buffer" a cloudinary
        const res = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({}, (err, res) => {
                if (err) {
                    reject(err);
                }

                resolve(res);
            }).end(buffer);
        })

        const image = new Image({
            name: name,
            public_id: res.public_id,
            description: description,
            route: res.secure_url,
        })
        await image.save();

        console.log("Imagen subida");

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

        return NextResponse.json({
            images
        });
    } catch (error) {
        return NextResponse.json({ err: error.message }, { status: 500 });

    };
};