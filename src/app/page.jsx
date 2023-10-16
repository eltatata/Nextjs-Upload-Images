import Grid from "@/components/Grid";
import Image from "@/models/Image";
import { connectionDB } from "@/utils/db";

async function loadImages() {
  connectionDB();
  const images = await Image.find().lean();
  return images;
};
export default async function Page() {

  let images = await loadImages();
  images = images.map(image => ({
    ...image,
    _id: image._id.toString()
  }));

  return (
    <div className="flex justify-center items-center">
      <div className="p-10 space-y-10">
        <h1 className="text-5xl font-bold text-center">Images</h1>
        <Grid images={images} />
      </div>
    </div>
  );
};