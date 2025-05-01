import AppError from "../../errors/AppError";
import prisma from "../../helper/prisma";
import { IContentLinks } from "./contentLinks.interface";
import httpStatus from "http-status";

const createContentLinksIntoDB = async (payload: IContentLinks) => {
  const result = await prisma.contentLinks.create({
    data: payload,
  });
  return result;
};

const getAllContentLinksFromDB = async () => {
  const result = await prisma.contentLinks.findMany({
    include: {
      content: true,
    },
  });
  return result;
};

const getSingleContentLinksFromDB = async (id: string) => {
  const result = await prisma.contentLinks.findUnique({
    where: {
      id,
    },
    include: {
      content: true,
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "ContentLinks not found!");
  }

  return result;
};

const updateContentLinksIntoDB = async (id: string, payload: IContentLinks) => {
  const isContentLinksExist = await prisma.contentLinks.findUnique({
    where: {
      id,
    },
  });

  if (!isContentLinksExist) {
    throw new AppError(httpStatus.NOT_FOUND, "ContentLinks not found!");
  }

  const result = await prisma.contentLinks.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteContentLinksFromDB = async (id: string) => {
  const isContentLinksExist = await prisma.contentLinks.findUnique({
    where: {
      id,
    },
  });

  if (!isContentLinksExist) {
    throw new AppError(httpStatus.NOT_FOUND, "ContentLinks not found!");
  }

  const result = await prisma.contentLinks.delete({
    where: {
      id,
    },
  });
  return result;
};

export const ContentLinksService = {
  createContentLinksIntoDB,
  getAllContentLinksFromDB,
  getSingleContentLinksFromDB,
  updateContentLinksIntoDB,
  deleteContentLinksFromDB,
};
