"use client";

import { useRouter } from 'next/navigation';
import { Button, useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { deleteImage } from '@/services/api';
import CustomModal from './Modal';

export default function Buttons({ imagen }) {
	const [updateImage, setupdateImage] = useState(false);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const router = useRouter();

	const handleDelete = async _id => {
		try {
			const res = await deleteImage(_id);
			if (!res) return;
			if (res.status == 200) {
				console.log(await res.json());
				router.refresh();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleUpdate = async () => {
		setupdateImage(imagen._id);
		onOpen();
	}

	return (
		<>
			<div className="mt-4">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
					<div className="flex flex-col mt-2 lg:flex-row lg:items-center lg:mt-0">
						<div className="mb-2 lg:mb-0 lg:mr-2">
							<Button
								onClick={() => handleUpdate()}
								size='sm'
								color='primary'
								variant="flat"
								className="w-full lg:w-auto"
							>
								Update
							</Button>
						</div>
						<Button
							onClick={() => handleDelete(imagen._id)}
							size='sm'
							color='danger'
							variant="flat"
							className="w-full lg:w-auto"
						>
							Delete
						</Button>
					</div>
				</div>
			</div>
			<CustomModal isOpen={isOpen} onClose={onOpenChange} selectedImage={updateImage} />
		</>
	);
};