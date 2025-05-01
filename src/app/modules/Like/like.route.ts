import express from "express";
import { CommentController } from "./like.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/",
 auth(UserRole.USER, UserRole.ADMIN),
  CommentController.addComment
);
router.get("/", CommentController.getAllComments);

router.patch(
  "/:id",

  CommentController.updateComment
);
router.delete("/:id", CommentController.deleteComment);

export const CommentRoutes = router;
