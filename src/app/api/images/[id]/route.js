import fs from 'fs';
import path from "path";
import { NextResponse } from "next/server";
import Image from '@/models/Image';
import { connectionDB } from '@/utils/db';

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

        const dirFile = path.join(process.cwd(), "public", image.route);
        fs.unlinkSync(dirFile);

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

        image.name = name;
        image.description = description;
        await image.save();

        return NextResponse.json({
            msg: `!Imagen '${params.id}' actualizada!`
        });
    } catch (error) {
        return NextResponse.json({ err: error.message }, { status: 404 });
    }
}