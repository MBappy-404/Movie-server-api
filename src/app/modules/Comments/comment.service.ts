import { Comment, Reviews, UserStatus } from "@prisma/client";

import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../helper/prisma";

const addComment = async (payload: Comment) => {
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

  const result = await prisma.comment.create({
    data: payload,
  });

  return result;
};

const getAllComments = async () => {
  const result = await prisma.comment.findMany();
  return result;
};

const updateComment = async (id: string, payload: Comment) => {
  const result = await prisma.comment.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteComment = async (id: string) => {
  const result = await prisma.comment.delete({
    where: {
      id,
    },
  });
  return result;
};

export const CommentServices = {
  addComment,
  getAllComments,
  updateComment,
  deleteComment,
};
