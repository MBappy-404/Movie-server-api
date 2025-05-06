import { Like, LikeStatus, UserStatus } from "@prisma/client";

import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../helper/prisma";


const addLike = async (payload: any, user: any) => {

  const { reviewId, status } = payload;

  // Check if the user already liked/disliked this review
  const existing = await prisma.like.findFirst({
    where: {
      userId: user.id,
      reviewId,
    },
  });

  let currentStatus: 'LIKED' | 'DISLIKED' | null = null;

  if (existing) {
    if (existing.status === status) {
      // Toggle off: user clicked the same action again
      await prisma.like.delete({
        where: {
          id: existing.id,
        },
      });
      currentStatus = null; // No current status
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
      currentStatus = status;
    }
  } else {
    // New like or dislike
    await prisma.like.create({
      data: {
        userId: user.id,
        reviewId,
        status,
      },
    });
    currentStatus = status;
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
    currentUserLikeStatus: currentStatus,
  };
};

const getLikeDislikeCounts = async (req: any,) => {
  const { reviewId } = req.params;

  const [likes, dislikes, userLike] = await Promise.all([
    prisma.like.count({
      where: {
        reviewId,
        status: 'LIKED',
      },
    }),
    prisma.like.count({
      where: {
        reviewId,
        status: 'DISLIKED',
      },
    }),
    prisma.like.findFirst({
      where: {
        reviewId,
        userId: req.user.id,
      },
      select: {
        status: true,
      },
    }),
  ]);

  return {
    reviewId,
    likeCount: likes,
    dislikeCount: dislikes,
    currentUserLikeStatus: userLike?.status ?? null,
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



export const LikeServices = {
  addLike,
  updateLike,
  getLikeDislikeCounts
};
