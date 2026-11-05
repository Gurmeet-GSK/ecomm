const UploadToCludinary = async (pics: any) => {
    const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "ut39wtdq";
    const upload_preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ecommerce_project";

    if (!pics) {
        throw new Error("No image file provided for upload.");
    }

    if (!cloud_name || !upload_preset) {
        throw new Error("Cloudinary configuration missing. Please verify VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.");
    }

    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", upload_preset);
    data.append("cloud_name", cloud_name);

    let res: Response;
    try {
        res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
            method: "POST",
            body: data,
        });
    } catch (networkError: any) {
        throw new Error("Network error while uploading image. Please check your internet connection.");
    }

    const fileData = await res.json();

    if (res.ok && (fileData.secure_url || fileData.url)) {
        return fileData.secure_url || fileData.url;
    }

    const serverMessage = fileData?.error?.message;
    if (serverMessage && serverMessage.toLowerCase().includes("upload preset not found")) {
        throw new Error(
            `Upload preset "${upload_preset}" was not found in Cloudinary account "${cloud_name}". ` +
            `Ensure an unsigned preset named "${upload_preset}" exists in your Cloudinary Settings > Upload Presets.`
        );
    }

    throw new Error(serverMessage || "Failed to upload image to Cloudinary");
};

export default UploadToCludinary;
