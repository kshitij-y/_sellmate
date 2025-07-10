import DataURIParser from "datauri/parser.js";
import path from "path";

const getDataUri = (file) => {
  if (!file || !file.originalname || !file.buffer) {
    throw new Error("Invalid file object: missing properties");
  }

  const parser = new DataURIParser();
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};

export default getDataUri;
