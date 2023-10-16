"use client"

import { Card, CardHeader, Image } from "@nextui-org/react";
import { useRouter } from 'next/navigation';

function Grid({ images }) {
  const router = useRouter();

  return (
    <div className="max-w-screen-xl mx-auto grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {images.map((imagen) => (
        <Card
          key={imagen._id}
          className="col-span-1"
        >
          <CardHeader className="absolute z-10 flex-col items-start bg-gradient-to-b from-black to-transparent">
            <p className="text-tiny text-white/60 uppercase font-bold">{imagen.name}</p>
            <h4 className="text-white font-medium text-large">{imagen.description}</h4>
          </CardHeader>
          <Image
            onClick={() => {
              router.push(`/images/${imagen._id}/`);
            }}
            removeWrapper
            alt="Card background"
            className="z-0 w-full h-full object-cover cursor-pointer"
            src={imagen.route}
          />
        </Card>
      ))}
    </div>
  );
};

export default Grid;