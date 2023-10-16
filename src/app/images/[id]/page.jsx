import Image from '@/models/Image';
import { connectionDB } from "@/utils/db";
import NextImage from "next/image";
import Buttons from '@/components/Buttons';

const getImage = async (id) => {
  connectionDB();
  const image = await Image.findById(id);
  if (!image) return "Image not found";
  return image;
}

async function ImagePage({ params }) {
  const image = await getImage(params.id);
  // image._id = image._id.toString();

  // console.log(image._id.toString())

  return (
    <div className="flex items-center justify-center h-full">
      <div className='flex items-center justify-center'>
        <NextImage
          priority
          as={NextImage}
          width={300}
          height={300}
          src={image.route}
          alt="NextUI hero Image"
          className="rounded-lg"
        />
        <div className="ml-4 w-2/5">
          <h2 className="mb-5 text-2xl font-bold">{image.name}</h2>
          <p className="mb-5 text-lg">{image.description}</p>
          <p className="mb-5 text-sm text-gray-500">{new Date(image.createdAt).toLocaleDateString()}</p>
          <div>
            <Buttons id={image._id.toString()} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImagePage