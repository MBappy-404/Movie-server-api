import { Comment, like, LikeStatus, Reviews, UserStatus } from "@prisma/client";

import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../helper/prisma";

const addLike = async (payload: like) => {
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

  const result = await prisma.like.create({
    data: payload,
  });

  return result;
};

const updateLike = async (id: string, payload: Comment) => {
  const result = await prisma.comment.update({
    where: {
      id,
    },
    data: {
      
    }
  });
  return result;
};

export const CommentServices = {
  addLike,
  updateLike,
};
