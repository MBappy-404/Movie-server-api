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

const getSingleComment = async (id: string, page: number = 1, limit: number = 5) => {
  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: {
        reviewId: id,
        parentId: null,
      },
      include: {
        user: true,
        replies: {
          include: {
            user: true,
            replies: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.comment.count({
      where: {
        reviewId: id,
        parentId: null,
      }
    })
  ]);

  return {
    data: comments,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getCommentsByParentId = async (parentId: string, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: {
        parentId: parentId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePhoto: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profilePhoto: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.comment.count({
      where: {
        parentId: parentId,
      }
    })
  ]);

  return {
    data: comments,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const CommentServices = {
  addComment,
  getAllComments,
  updateComment,
  deleteComment,
  getSingleComment,
  getCommentsByParentId
};
