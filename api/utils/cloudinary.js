import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dp997kk6q",
  api_key: "195683941756771",
  api_secret: "zd9aF_2zBuR8KIJWNU9T_gYj1pk",
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (err) {
    fs.unlinkSync(localFilePath);
  }
};

const deleteonCloudinary = async (public_id, resource_type = "image") => {
  try {
    if (!public_id) return null;
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: `${resource_type}`,
    });
  } catch (error) {
    console.log("Error cloudinary:", error);
    return error;
  }
};
export { uploadOnCloudinary, deleteonCloudinary };
