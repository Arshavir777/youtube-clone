const cloudinaryName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME!;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET!;

interface UploadOptions {
  onProgress?: (progress: number) => void;
}

interface UploadResult {
  url: string;
  publicId: string;
  thumbnail: string;
  duration: number;
  format: string;
}

export async function uploadVideo(file: File, options?: UploadOptions): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && options?.onProgress) {
        const progress = Math.round((e.loaded / e.total) * 100);
        options.onProgress(progress);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({
            url: data.secure_url,
            publicId: data.public_id,
            thumbnail: data.eager?.[0]?.secure_url || data.secure_url.replace(/\.[^.]+$/, ".jpg"),
            duration: data.duration,
            format: data.format,
          });
        } catch (error) {
          if (error instanceof Error)
            reject(new Error("Failed to parse upload response"));
          else
            reject(new Error("Something went wrong"));
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload cancelled"));
    });

    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudinaryName}/video/upload`);
    xhr.send(formData);
  });
}