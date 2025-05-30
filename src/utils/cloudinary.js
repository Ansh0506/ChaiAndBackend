import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET

});

const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null;
        const response = await cloudinary.v2.uploader.upload(localFilePath,{
            resourse_type: "auto"
        })

        console.log("file is successfully uploaded",response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)  //it removes the temp file from local server
        return null;
    }
}

export {uploadOnCloudinary}
// cloudinary.v2.uploader.upload("url",{public_id:""},function(error,result){console.log(result);});