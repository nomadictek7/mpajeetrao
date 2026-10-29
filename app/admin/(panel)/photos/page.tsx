import { getPhotos } from "@/lib/store";
import PhotoManager from "./PhotoManager";

export default async function PhotosPage() {
  const photos = await getPhotos();
  return (
    <>
      <h1 className="mb-6 font-display text-3xl font-bold">Photos</h1>
      <PhotoManager photos={photos} />
    </>
  );
}
