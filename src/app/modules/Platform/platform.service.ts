import prisma from "../../helper/prisma";
import { TPlatform } from "./platform.interface";

const createPlatfromIntoDB = async (platform: TPlatform) => {
  const result = await prisma.platform.create({
    data: platform,
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

const updatePlatformIntoDB = async (id: string, platform: TPlatform) => {
  await prisma.platform.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.platform.update({
    where: {
      id,
    },
    data: platform,
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
