const cloudinaryName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME!;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET!;

export async function uploadVideo(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryName}/video/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    url: data.secure_url,
    publicId: data.public_id,
    thumbnail: data.eager?.[0]?.secure_url || data.secure_url.replace(/\.[^.]+$/, ".jpg"),
    duration: data.duration,
    format: data.format,
  };
}