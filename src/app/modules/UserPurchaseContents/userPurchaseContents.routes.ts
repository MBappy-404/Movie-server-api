import express from "express";

import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";
import { UserPurchaseContentsController } from "./userPurchaseContents.controller";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN),
  UserPurchaseContentsController.getAllUserPurchaseContents
);

router.get(
  "/my-purchase-contents",
  auth(UserRole.USER),
  UserPurchaseContentsController.getMyPurchaseContents
);

export const UserPurchaseContentsRoutes = router;
