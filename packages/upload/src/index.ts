import { configDotenv } from "dotenv";
import { v2 as cloudinary } from "cloudinary";

configDotenv();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (filePath: string, folder = "products") => {
  const res = await cloudinary.uploader.upload(filePath, { folder });
  return res.secure_url;
};

export * from "./getDataUri.js";
export default cloudinary;
