import { Reviews, ReviewStatus, User, UserStatus } from "@prisma/client";
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
  const result = await prisma.reviews.findMany({
    include:{
      comment:true,
      like:true,
    }
  });
  return result;
};
const getSingleReviews = async (id: string) => {
  const result = await prisma.reviews.findUnique({
    where: {
      id,
    },
    include:{
      comment:true,
    }
  });
  return result;
};


const updateReview = async (id: string, payload: Reviews) => {

  const checkReview = await prisma.reviews.findUnique({
    where: {id, status: ReviewStatus.PUBLISHED}
  })
  if(checkReview){
    throw new AppError(httpStatus.BAD_REQUEST, "Review already published")
  }

  const result = await prisma.reviews.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteReview = async (id: string) => {
  const result = await prisma.reviews.delete({
    where: {
      id,
    },
  });
  return result;
};

export const ReviewsService = {
  addReviews,
  getAllReviews,
  getSingleReviews,
  updateReview,
  deleteReview,
};
