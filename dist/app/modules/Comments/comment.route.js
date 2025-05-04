"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const comment_controller_1 = require("./comment.controller");
const router = express_1.default.Router();
router.post("/", 
//  auth(UserRole.USER, UserRole.ADMIN),
comment_controller_1.CommentController.addComment);
router.get("/", comment_controller_1.CommentController.getAllComments);
router.get("/nested/:id", comment_controller_1.CommentController.getSingleComment);
router.patch("/:id", comment_controller_1.CommentController.updateComment);
router.delete("/:id", comment_controller_1.CommentController.deleteComment);
router.get("/parent/:parentId", comment_controller_1.CommentController.getCommentsByParentId);
exports.CommentRoutes = router;
