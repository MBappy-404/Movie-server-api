"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentLinksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const contentLinks_controller_1 = require("./contentLinks.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.ADMIN), contentLinks_controller_1.ContentLinksController.createContentLinksIntoDB);
router.get("/", contentLinks_controller_1.ContentLinksController.getAllContentLinksFromDB);
router.get("/:id", contentLinks_controller_1.ContentLinksController.getSingleContentLinksFromDB);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), contentLinks_controller_1.ContentLinksController.updateContentLinksIntoDB);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), contentLinks_controller_1.ContentLinksController.deleteContentLinksFromDB);
exports.ContentLinksRoutes = router;
