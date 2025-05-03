"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeServices = void 0;
const prisma_1 = __importDefault(require("../../helper/prisma"));
const addLike = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, reviewId, status } = payload;
    // Check if the user already liked/disliked this review
    const existing = yield prisma_1.default.like.findFirst({
        where: {
            userId,
            reviewId,
        },
    });
    if (existing) {
        if (existing.status === status) {
            // Toggle off: user clicked the same action again
            yield prisma_1.default.like.delete({
                where: {
                    id: existing.id,
                },
            });
        }
        else {
            // Switch from like to dislike or vice versa
            yield prisma_1.default.like.update({
                where: {
                    id: existing.id,
                },
                data: {
                    status,
                },
            });
        }
    }
    else {
        // New like or dislike
        yield prisma_1.default.like.create({
            data: {
                userId,
                reviewId,
                status,
            },
        });
    }
    // Get updated counts
    const likes = yield prisma_1.default.like.count({
        where: {
            reviewId,
            status: 'LIKED',
        },
    });
    const dislikes = yield prisma_1.default.like.count({
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
});
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
const updateLike = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.like.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const getLikeDislikeCounts = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const likes = yield prisma_1.default.like.count({
        where: {
            reviewId,
            status: 'LIKED',
        },
    });
    const dislikes = yield prisma_1.default.like.count({
        where: {
            reviewId,
            status: 'DISLIKED',
        },
    });
    return { likes, dislikes };
});
exports.LikeServices = {
    addLike,
    updateLike,
};
