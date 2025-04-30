import express from "express";
import { platformController } from "./platform.controller";
import validateRequest from "../../middleware/validateRequest";
import { platformValidations } from "./platform.validation";
const router = express.Router();
router.post(
  "/",
  validateRequest(platformValidations.createPlatformValidationSchema),
  platformController.createPlaform
);
router.get("/", platformController.getAllPlatforms);
router.get("/:id", platformController.getSinglePlatform);
router.patch(
  "/:id",
  validateRequest(platformValidations.updatePlatformValidationSchema),
  platformController.updatePlatform
);
router.delete("/:id", platformController.deletePlatform);

export const PlatformRoutes = router;
