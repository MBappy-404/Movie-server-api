import express from "express";
import { ContentController } from "./content.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", auth(UserRole.ADMIN), ContentController.createContent);
router.get("/", ContentController.getAllContentData);
router.get("/:id", ContentController.getSingleContent);
router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  ContentController.deleteSingleContent
);

export const ContentRoutes = router;
