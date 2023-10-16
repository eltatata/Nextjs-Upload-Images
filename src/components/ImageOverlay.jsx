"use client";

import { useState } from "react";
import { Image } from "@nextui-org/react";

export default function ImageOverlay({ imagen, index }) {
  const [overlayIndex, setOverlayIndex] = useState(null);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOverlayIndex(index)}
      onMouseLeave={() => setOverlayIndex(null)}
    >
      <Image
        key={index}
        isBlurred
        width={240}
        src={imagen.route}
        alt={imagen.name}
        classNames="m-5"
        radius='md'
      />
      {overlayIndex === index && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 flex flex-col justify-center items-center z-10 p-4 rounded-md">
          <strong className="mb-1 text-2xl">{imagen.name.split(".")[0]}</strong>
          <p className="text-center mb-2">{imagen.description}</p>
          <p>
            {new Date(imagen.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};