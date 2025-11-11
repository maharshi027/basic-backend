import {v2 as cloudinary} from 'cloudinary';

import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async(filePath) => {
    try{
        if(!filePath) return null;
       const response = await cloudinary.uploader.upload(filePath,{
            resource_type : "auto"
        })
        // after upload remove file from server
        // console.log("file has been uploaded on cloudinary", response.url);
        fs.unlinkSync(filePath);
        return response;
    }
     catch (error){
        fs.unlinkSync(filePath); // remove the locally saved temporary filed as the upload operation failed
        console.error("Error while uploading file to cloudinary", error);
        throw error;
    }
}

export {uploadToCloudinary};

    