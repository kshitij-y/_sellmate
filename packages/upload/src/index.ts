import { configDotenv } from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import DataURIParser from "datauri/parser.js";
import path from "path";

configDotenv();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// File to Data URI converter
export const getDataUri = (file: { originalname: string; buffer: Buffer }) => {
  const parser = new DataURIParser();
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};

export default cloudinary;
