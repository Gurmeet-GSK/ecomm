const UploadToCludinary = async(pics:any) => {

    const cloud_name = "r5rzdtb5";
    const upload_preset = "ecommerce_project";

    if(pics){
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", upload_preset);
        data.append("cloud_name", cloud_name);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
            method: "POST",
            body: data,
        }); 

        const fileData  = await res.json();
        return fileData.url;
    }
    else{
        console.log("Error: Please upload an image");
    }


};

export default UploadToCludinary;  
