import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ICloudinaryResponse, IFile } from "../interface/file.type";
import config from "../config";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const isVercel = process.env.VERCEL === '1';
const uploadPath = isVercel ? '/tmp' : path.join(process.cwd(), 'tmp');

// Create local tmp folder if it doesn't exist
if (!isVercel && !fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

const uploadToCloudinary = async (file: IFile): Promise<ICloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, (error: Error, result: ICloudinaryResponse) => {
      try {
        fs.unlinkSync(file.path);
      } catch (e) {
        console.error('Error deleting temp file:', e);
      }

      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

export const FileUploader = {
  upload,
  uploadToCloudinary,
};
