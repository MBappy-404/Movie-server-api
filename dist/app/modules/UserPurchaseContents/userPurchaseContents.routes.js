"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPurchaseContentsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const userPurchaseContents_controller_1 = require("./userPurchaseContents.controller");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), userPurchaseContents_controller_1.UserPurchaseContentsController.getAllUserPurchaseContents);
router.get("/my-purchase-contents", (0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), userPurchaseContents_controller_1.UserPurchaseContentsController.getMyPurchaseContents);
exports.UserPurchaseContentsRoutes = router;
