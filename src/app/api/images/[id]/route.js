import fs from 'fs';
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { NextResponse } from "next/server";
import Image from '@/models/Image';
import { connectionDB } from '@/utils/db';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function GET(req, { params }) {
    connectionDB();

    try {
        const imageId = params.id;
        const image = await Image.findById(imageId);

        if (!image) return NextResponse.json({ message: "Image not found" }, { status: 404 });

        return NextResponse.json(image);
    } catch (error) {
        return NextResponse.json({ err: error.message }, { status: 404 });
    }
}

export async function DELETE(req, { params }) {
    connectionDB();

    try {
        // obtener el "id" de la tarea y elimnarla de la DB
        const imageId = params.id;
        const image = await Image.findByIdAndDelete(imageId);

        if (!image) return NextResponse.json({ message: "Image not found" }, { status: 404 });

        const ruta = path.join(__dirname, '../../../../../public/upload', image.name);
        fs.unlinkSync(ruta);

        return NextResponse.json({
            msg: `!Imagen '${imageId}' eliminada!`
        });
    } catch (error) {
        return NextResponse.json({ err: error.message }, { status: 404 });
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

        // cambiar el nombre pero manteniendo su extencion original
        const extName = image.name.split(".")[1];
        const newName = `${name}.${extName}`;

        // si el nombre a actualizar ya existe lanzar un error
        if (await Image.findOne({ name: newName })) throw new Error("Ya existe una imagen con ese nombre");

        const dirFile = path.join(__dirname, `../../../../../public/upload/${image.name}`);

        // cambiar el nombre de la imagen en el servidor
        fs.renameSync(dirFile, path.join(__dirname, `../../../../../public/upload/${newName}`));

        image.name = newName;
        image.description = description;
        image.route = `/upload/${newName}`;
        await image.save();

        return NextResponse.json({
            msg: `!Imagen '${params.id}' actualizada!`
        });
    } catch (error) {
        return NextResponse.json({ err: error.message }, { status: 404 });
    }
}