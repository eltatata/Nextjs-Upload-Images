"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { Input, Textarea } from '@nextui-org/react';
import { createImage, updateImage, getImage } from '@/services/api';

export default function CustomModal({ isOpen, onClose }) {
  const [data, setData] = useState({
    name: "",
    description: "",
    file: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el envío
  const router = useRouter();
  const params = useParams();

  // si se selecciono una imagen, rellenar los campos con la informacion de la seleccionada
  useEffect(() => {
    const loadImage = async () => {
      if (params.id) {
        const image = await getImage(params.id);

        setData({
          name: image.name.split(".")[0],
          description: image.description,
        });
      }
    }

    loadImage();
  }, []);

  const refresh = () => {
    // vaciar los inputs para evitar errores
    setData({
      name: "",
      description: "",
      file: null
    });
    // cerrar el modal una vez se halla cargado la imagen
    onClose();
    router.refresh()
  };

  const handleChange = e => {
    if (e.target.type == 'file') {
      setData({
        ...data,
        [e.target.name]: e.target.files?.[0]
      })
    } else {
      setData({
        ...data,
        [e.target.name]: e.target.value
      })
    };
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (!params.id) {
        const res = await createImage(data);
        if (!res) return;
        console.log(await res.json());
        refresh();
      } else {
        const res = await updateImage(params.id, data);
        if (!res) return;
        console.log(await res.json());
        refresh();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      backdrop="opaque"
      isOpen={isOpen}
      onOpenChange={onClose}
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Upload your image</ModalHeader>
        <ModalBody>
          <Input
            type='file'
            name='file'
            label="Choose your image"
            placeholder="Choose your image"
            onChange={handleChange}
            className={!params.id ? "block" : "hidden"}
          />
          <Input
            type="text"
            name='name'
            label="Name"
            placeholder='Enter a name'
            onChange={handleChange}
            value={data.name}
          />
          <Textarea
            name='description'
            label="Description"
            placeholder="Enter your description"
            onChange={handleChange}
            value={data.description}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button
            color='success'
            variant="flat"
            onPress={handleSubmit}
            isDisabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
