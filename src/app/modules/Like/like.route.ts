import express from "express";

import { LikeController } from "./like.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  LikeController.addLike
);

router.get('/:reviewId', LikeController.GetLikesDislikesByReviewId)

router.patch(
  "/:id",
  LikeController.updateLike
);

export const LikeRoutes = router;
