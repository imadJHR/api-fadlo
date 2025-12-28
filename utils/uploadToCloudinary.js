import cloudinary from "../config/cloudinary.js";

export function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder: "uploads",   // folder par défaut
          ...options,          // peut override: { folder: "brands" } etc.
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      )
      .end(buffer);
  });
}