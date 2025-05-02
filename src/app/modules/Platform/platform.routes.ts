import express, { NextFunction, Request, Response } from "express";
import { platformController } from "./platform.controller";
import validateRequest from "../../middleware/validateRequest";
import { platformValidations } from "./platform.validation";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";
import { FileUploader } from "../../helper/fileUploader";
const router = express.Router();
router.post(
  "/",
  auth(UserRole.ADMIN), FileUploader.upload.single('file'), (req: Request, res: Response, next: NextFunction)=> {
    req.body = platformValidations.createPlatformValidationSchema.parse(JSON.parse(req.body.data))
    return platformController.createPlaform(req, res, next)
  } 
);
router.get("/", platformController.getAllPlatforms);
router.get("/:id", platformController.getSinglePlatform);
router.patch(
  "/:id",
  auth(UserRole.ADMIN), FileUploader.upload.single('file'), (req: Request, res: Response, next: NextFunction)=> {
    req.body = platformValidations.updatePlatformValidationSchema.parse(JSON.parse(req.body.data))
    return platformController.updatePlatform(req, res, next)
  }
);
router.delete("/:id", auth(UserRole.ADMIN), platformController.deletePlatform);

export const PlatformRoutes = router;
