import express, { NextFunction, Request, Response } from "express";
import { ContentController } from "./content.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";
import { FileUploader } from "../../helper/fileUploader";
import { ContentValidation } from "./content.validation";

const router = express.Router();

router.post("/", auth(UserRole.ADMIN), FileUploader.upload.single('file'), (req: Request, res: Response, next: NextFunction)=> {
  req.body = ContentValidation.CreateContentValidationSchema.parse(JSON.parse(req.body.data))
  return ContentController.createContent(req, res, next)
} );
router.get("/", ContentController.getAllContentData);
router.get("/:id", ContentController.getSingleContent);
router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  ContentController.deleteSingleContent
);
router.patch("/:id", auth(UserRole.ADMIN), FileUploader.upload.single('file'),  (req: Request, res: Response, next: NextFunction)=> {
  req.body = ContentValidation.updateContentValidationSchema.parse(JSON.parse(req.body.data))
  return ContentController.updateContent(req, res, next)
});


export const ContentRoutes = router;
