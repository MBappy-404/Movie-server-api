import express from "express";
import { ContentLinksController } from "./contentLinks.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN),
  ContentLinksController.createContentLinksIntoDB
);

router.get("/", ContentLinksController.getAllContentLinksFromDB);
router.get("/:id", ContentLinksController.getSingleContentLinksFromDB);
router.patch(
  "/:id",
  auth(UserRole.ADMIN),
  ContentLinksController.updateContentLinksIntoDB
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  ContentLinksController.deleteContentLinksFromDB
);

export const ContentLinksRoutes = router;
