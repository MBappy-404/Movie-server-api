"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const content_controller_1 = require("./content.controller");
const router = express_1.default.Router();
router.post("/", content_controller_1.ContentController.createContent);
router.get("/", content_controller_1.ContentController.getAllContentData);
router.get("/:id", content_controller_1.ContentController.getSingleContent);
router.delete("/:id", content_controller_1.ContentController.deleteSingleContent);
exports.ContentRoutes = router;
