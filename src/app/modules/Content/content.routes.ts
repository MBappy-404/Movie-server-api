import express from "express";
import { ContentController } from "./content.controller";

const router = express.Router();

router.post("/", ContentController.createContent);

router.get("/:id", ContentController.getSingleContent);

router.delete("/:id", ContentController.deleteSingleContent);

export const ContentRoutes = router;
