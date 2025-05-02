import { Like, LikeStatus, UserStatus } from "@prisma/client";

import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../helper/prisma";


const addLike = async (payload: any) => {
  const { userId, reviewId, status } = payload;

  // Check if the user already liked/disliked this review
  const existing = await prisma.like.findFirst({
    where: {
      userId,
      reviewId,
    },
  });

  if (existing) {
    if (existing.status === status) {
      // Toggle off: user clicked the same action again
      await prisma.like.delete({
        where: {
          id: existing.id,
        },
      });
    } else {
      // Switch from like to dislike or vice versa
      await prisma.like.update({
        where: {
          id: existing.id,
        },
        data: {
          status,
        },
      });
    }
  } else {
    // New like or dislike
    await prisma.like.create({
      data: {
        userId,
        reviewId,
        status,
      },
    });
  }

  // Get updated counts
  const likes = await prisma.like.count({
    where: {
      reviewId,
      status: 'LIKED',
    },
  });

  const dislikes = await prisma.like.count({
    where: {
      reviewId,
      status: 'DISLIKED',
    },
  });

  // Return updated counts
  return {
    reviewId,
    likeCount: likes,
    dislikeCount: dislikes,
  };
};

// const addLike = async (payload: Like) => {
//   const isUserExist = await prisma.user.findUnique({
//     where: {
//       id: payload.userId,
//     },
//   });

//   const isUserBlockedOrDeleted =
//     isUserExist?.status === UserStatus.BLOCKED ||
//     isUserExist?.status === UserStatus.DELETED;

//   if (!isUserExist || isUserBlockedOrDeleted) {
//     throw new AppError(
//       httpStatus.NOT_FOUND,
//       "User not found or blocked/deleted"
//     );
//   }

//   const isLikeExist = await prisma.like.findFirst({
//     where:{
//       reviewId: payload.reviewId,
//       userId: payload.userId,
      
//     }
//   }) 

//   if (isLikeExist) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       `You have already ${isLikeExist.status.toLowerCase()} this review.`
//     );
//   }

//   const result = await prisma.like.create({
//     data: payload,
//   });

//   return result;
// };

const updateLike = async (id: string, payload: Like) => {
  const result = await prisma.like.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const getLikeDislikeCounts = async (reviewId: string) => {
  const likes = await prisma.like.count({
    where: {
      reviewId,
      status: 'LIKED',
    },
  });

  const dislikes = await prisma.like.count({
    where: {
      reviewId,
      status: 'DISLIKED',
    },
  });

  return { likes, dislikes };
};

export const LikeServices = {
  addLike,
  updateLike,
};
