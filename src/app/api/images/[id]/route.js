import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from "next/server";
import Image from '@/models/Image';
import { connectionDB } from '@/utils/db';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

export async function GET(req, { params }) {
    connectionDB();

    try {
        const imageId = params.id;
        const image = await Image.findById(imageId);

        if (!image) return NextResponse.json({ message: "Image not found" }, { status: 404 });

        return NextResponse.json(image);
    } catch (error) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    connectionDB();

    try {
        // obtener el "id" de la tarea y elimnarla de la DB
        const imageId = params.id;
        const image = await Image.findByIdAndDelete(imageId);

        if (!image) return NextResponse.json({ message: "Image not found" }, { status: 404 });

        const { public_id } = image; // public_id de la imagen a eliminar
        // eliminar imagen de cloudinary
        cloudinary.uploader.destroy(public_id, (error, result) => {
            if (result.result == "ok") {
                console.log("Eliminada de clodinary");
            } else {
                console.log("Error al eliminar la imagen en Cloudinary");
            }
        });

        return NextResponse.json({ msg: `!Imagen '${imageId}' eliminada!` });
    } catch (error) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
};

export async function PUT(req, { params }) {
    connectionDB();

    try {
        const data = await req.json();

        const { name, description } = data;

        const imageId = params.id;
        const image = await Image.findById(imageId);
        if (!image) return NextResponse.json({ message: "Image not found" }, { status: 404 });

        image.name = name;
        image.description = description;
        await image.save();

        return NextResponse.json({
            msg: `!Imagen '${params.id}' actualizada!`
        });
    } catch (error) {
        return NextResponse.json({ err: error.message }, { status: 500 });
    }
}