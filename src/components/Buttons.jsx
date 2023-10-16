"use client";

import { useRouter } from 'next/navigation';
import { Button, useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { deleteImage } from '@/services/api';
import CustomModal from './Modal';

export default function Buttons({ id }) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const router = useRouter();

	const handleDelete = async () => {
		try {
			console.log(id)
			const res = await deleteImage(id);
			if (!res) return;
			if (res.status == 200) {
				console.log(await res.json());
				router.push("/")
				router.refresh();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleUpdate = async () => {
		onOpen();
	}

	return (
		<>
			<Button
				onClick={() => handleUpdate()}
				size='sm'
				color='primary'
				variant="flat"
			>
				Update
			</Button>
			<Button
				onClick={() => handleDelete()}
				size='sm'
				color='danger'
				variant="flat"
			>
				Delete
			</Button>
			<CustomModal isOpen={isOpen} onClose={onOpenChange} />
		</>
	);
};