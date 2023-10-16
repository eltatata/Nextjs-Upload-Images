import mongoose from "mongoose";

// esto sirve para saber cual es el estado de la conexion
const conn = {
    isConnected: false
};

export const connectionDB = async () => {
    // saber si se esta conectado a la base de datos
    if (conn.isConnected) return; // se retorna para que no se vuelva a establecer conexion

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Conectado a MongoDB '${db.connection.name}'`);
        // cuando se realize la conexion a la DB actualizar el estado
        conn.isConnected = db.connections[0].readyState;
    } catch (error) {
        console.log(error.message);
    };
};