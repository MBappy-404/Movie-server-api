import express from "express";
import { ReviewsController } from "./reviews.controller";

const router = express.Router();

router.post("/", ReviewsController.addReviews);
router.get("/", ReviewsController.getAllReviews);
router.get("/:id", ReviewsController.getSingleReviews);

export const ReviewsRoutes = router;
