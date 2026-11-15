export const uploadToCloudinaryWithProgress = (upload, file, onProgress = () => {}) =>
  new Promise((resolve, reject) => {
    const formData = new FormData();

    Object.entries(upload.params || {}).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    formData.append("api_key", upload.apiKey);
    formData.append("signature", upload.signature);
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${upload.cloudName}/${upload.resourceType}/upload`
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      let result = {};
      try {
        result = JSON.parse(xhr.responseText || "{}");
      } catch {
        reject(new Error("Cloudinary returned an invalid response."));
        return;
      }

      if (xhr.status >= 200 && xhr.status < 300) resolve(result);
      else reject(new Error(result?.error?.message || "File upload failed."));
    };
    xhr.onerror = () => reject(new Error("Network error while uploading the file."));
    xhr.onabort = () => reject(new Error("File upload was cancelled."));
    xhr.send(formData);
  });
