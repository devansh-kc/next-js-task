import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath: any): Promise<any> => {
  try {
    if (!localFilePath) {
      console.log("Could not find the path");
      return null;
    }

    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfull

    // console.log("file is uploaded on cloudinary",response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log("Error in uploading image on clodinary", error);
    fs.unlinkSync(localFilePath); //It will remove the locallly saved temp file as the operation fails
    return null;
  }
};
export const deleteFromCloudinary = async (filePath: any): Promise<any> => {
  console.log(filePath);
  try {
    if (!filePath) null;

    await cloudinary.uploader.destroy(
      filePath.split("/").pop().split(".")[0],
      (error: any) => {
        if (error) {
          console.log("error while deleting the file from cloudinary", error);
          return null;
        }
      }
    );
  } catch (error) {
    console.log("error from cloudinay :", error);
  }
};
