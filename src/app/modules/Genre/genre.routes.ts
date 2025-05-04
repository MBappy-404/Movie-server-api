import express from "express";
import { GenreController } from "./genre.controller";

const router = express.Router();

router.post("/", GenreController.createGenre);

router.get("/", GenreController.getAllGenre);

router.patch("/:id", GenreController.updateGenre);

router.delete("/:id", GenreController.deleteGenre);

export const GenreRoutes = router;
