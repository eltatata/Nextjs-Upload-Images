import { Schema, model, models } from "mongoose";

const imageSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    originalName: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,

    },
    route: {
        type: String,
        required: true,
        trim: true,
    }
}, {
    timestamps: true
});

export default models.Image || model("Image", imageSchema);