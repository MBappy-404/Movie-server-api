import express from "express";

import { LikeController } from "./like.controller";

const router = express.Router();

router.post(
  "/",

  LikeController.addLike
);

router.patch(
  "/:id",

  LikeController.updateLike
);

export const LikeRoutes = router;
