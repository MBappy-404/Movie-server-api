import { platform } from "os";
import prisma from "../../helper/prisma";
import { TPlatform } from "./platform.interface";
import { FileUploader } from "../../helper/fileUploader";
import { IFile } from "../../interface/file.type";

const createPlatfromIntoDB = async (req: any) => {

  const file = req.file as IFile;

  if (file) {
    const uploadData = await FileUploader.uploadToCloudinary(file);
    req.body.platformLogo = uploadData?.secure_url;
  }

  const result = await prisma.platform.create({
    data: req.body,
  });

  return result;
};

const getAllPlatformsFromDB = async () => {
  const result = await prisma.platform.findMany();
  return result;
};

const getSinglePlatformFromDB = async (id: string) => {
  const result = await prisma.platform.findUniqueOrThrow({
    where: {
      id,
    },
  });
  return result;
};

const updatePlatformIntoDB = async (req: any) => {
  const { id } = req.params;

  await prisma.platform.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const file = req.file as IFile;

  if (file) {
    const uploadData = await FileUploader.uploadToCloudinary(file);
    req.body.platformLogo = uploadData?.secure_url;
  }

  const result = await prisma.platform.update({
    where: {
      id,
    },
    data: req.body as TPlatform ,
  });
  return result;
};

const deletePlatformFromDB = async (id: string) => {
  const result = await prisma.platform.delete({
    where: {
      id,
    },
  });
  return result;
};

export const platformService = {
  createPlatfromIntoDB,
  getAllPlatformsFromDB,
  getSinglePlatformFromDB,
  updatePlatformIntoDB,
  deletePlatformFromDB,
};
