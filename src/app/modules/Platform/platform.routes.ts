import express from "express";
import { platformController } from "./platform.controller";
import validateRequest from "../../middleware/validateRequest";
import { platformValidations } from "./platform.validation";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();
router.post(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(platformValidations.createPlatformValidationSchema),
  platformController.createPlaform
);
router.get("/", platformController.getAllPlatforms);
router.get("/:id", platformController.getSinglePlatform);
router.patch(
  "/:id",
  auth(UserRole.ADMIN),
  validateRequest(platformValidations.updatePlatformValidationSchema),
  platformController.updatePlatform
);
router.delete("/:id", auth(UserRole.ADMIN), platformController.deletePlatform);

export const PlatformRoutes = router;
