import express from "express";
import { CommentController } from "./comment.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/",
  //  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.addComment
);
router.get("/", CommentController.getAllComments);

router.get("/nested/:id", CommentController.getSingleComment);

router.patch(
  "/:id",

  CommentController.updateComment
);
router.delete("/:id", CommentController.deleteComment);

router.get(
  "/parent/:parentId",
  CommentController.getCommentsByParentId
);

export const CommentRoutes = router;
