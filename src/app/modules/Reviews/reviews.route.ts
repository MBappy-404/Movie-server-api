import express from "express";
import { ReviewsController } from "./reviews.controller";
import validateRequest from "../../middleware/validateRequest";
import { ReviewValidations } from "./reviews.validation";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(ReviewValidations.addReviewValidationSchema),
  ReviewsController.addReviews
);
router.get("/", ReviewsController.getAllReviews);
router.get("/:id", ReviewsController.getSingleReviews);
router.patch(
  "/:id",
  validateRequest(ReviewValidations.updateReviewValidationSchema),
  ReviewsController.updateReview
);
router.delete("/:id", ReviewsController.deleteReview);
router.get('/stats', ReviewsController.getReviewStats);

export const ReviewsRoutes = router;
