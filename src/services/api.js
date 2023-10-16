const API_URL = "/api/images/";

export const getImage = async id => {
    const res = await fetch(`/api/images/${id}`);
    const image = res.json();

    return image;
};

export const createImage = async data => {
    if (!data.file || !data.name) {
        alert('Llena los campos requeridos');
        return;
    };

    try {
        // contruir el formData para mandar a la API
        const formData = new FormData();
        formData.set('image', data.file);
        formData.set('name', data.name);
        formData.set('description', data.description);

        const res = await fetch(API_URL, {
            method: "POST",
            body: formData,
        });

        return res;
    } catch (error) {
        throw new Error('Hubo un problema al crear la imagen: ' + error.message);
    };
};

export const updateImage = async (id, data) => {
    if (!data.name) {
        alert('Llena los campos requeridos');
        return;
    };

    try {
        const res = await fetch(API_URL + id, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            }
        });

        return res;
    } catch (error) {
        throw new Error('Hubo un problema al actualizar la imagen: ' + error.message);
    };
};

export const deleteImage = async id => {
    try {
        if (window.confirm("Seguro que quieres eliminar la imagen?")) {
            const res = await fetch(API_URL + id, {
                method: "DELETE"
            });

            return res;
        };
    } catch (error) {
        throw new Error('Hubo un problema al eliminar la imagen: ' + error.message);
    }
};