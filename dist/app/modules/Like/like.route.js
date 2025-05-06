"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const like_controller_1 = require("./like.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), like_controller_1.LikeController.addLike);
router.get('/:reviewId', like_controller_1.LikeController.GetLikesDislikesByReviewId);
router.patch("/:id", like_controller_1.LikeController.updateLike);
exports.LikeRoutes = router;
