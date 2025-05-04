"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreRoutes = void 0;
const express_1 = __importDefault(require("express"));
const genre_controller_1 = require("./genre.controller");
const router = express_1.default.Router();
router.post("/", genre_controller_1.GenreController.createGenre);
router.get("/", genre_controller_1.GenreController.getAllGenre);
router.patch("/:id", genre_controller_1.GenreController.updateGenre);
router.delete("/:id", genre_controller_1.GenreController.deleteGenre);
exports.GenreRoutes = router;
