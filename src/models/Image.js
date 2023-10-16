import { Schema, model, models } from "mongoose";

const imageSchema = new Schema({
    name: {
        type: String,
        required: true,
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