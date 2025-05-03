import multer from "multer"
import path from "path"
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import { ICloudinaryResponse, IFile } from "../interface/file.type";
import config from "../config";

cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
});

// Use /tmp (writable) instead of project directory (read-only)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,  path.join(process.cwd(), 'tmp')) // writable directory in Lambda
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname) // add timestamp to avoid collisions
    }
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file: IFile): Promise<ICloudinaryResponse | undefined> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path, (error: Error, result: ICloudinaryResponse) => {
            try {
                fs.unlinkSync(file.path); // cleanup
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
    uploadToCloudinary
};
