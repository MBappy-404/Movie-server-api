import { Reviews, User, UserStatus } from "@prisma/client";
import prisma from "../../helper/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const addReviews = async (payload: Reviews) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
  });

  const isUserBlockedOrDeleted =
    isUserExist?.status === UserStatus.BLOCKED ||
    isUserExist?.status === UserStatus.DELETED;

  if (!isUserExist || isUserBlockedOrDeleted) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found or blocked/deleted"
    );
  }

  const result = await prisma.reviews.create({
    data: payload,
  });

  return result;
};

const getAllReviews = async () => {
  const result = await prisma.reviews.findMany();
  return result;
};
const getSingleReviews = async (id: string) => {
  const result = await prisma.reviews.findUnique({
    where: {
      id,
    },
  });
  return result;
};

export const ReviewsService = {
  addReviews,
  getAllReviews,
  getSingleReviews
};
