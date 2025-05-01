import { Like, UserStatus } from "@prisma/client";

import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../helper/prisma";

const addLike = async (payload: Like) => {
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

  const isLikeExist = await prisma.like.findFirst({
    where:{
      reviewId: payload.reviewId,
      userId: payload.userId,
      
    }
  }) 

  if (isLikeExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You have already ${isLikeExist.status.toLowerCase()} this review.`
    );
  }

  const result = await prisma.like.create({
    data: payload,
  });

  return result;
};

const updateLike = async (id: string, payload: Like) => {
  const result = await prisma.like.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

export const LikeServices = {
  addLike,
  updateLike,
};
