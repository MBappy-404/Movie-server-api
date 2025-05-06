"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.patch('/:userId/block', admin_controller_1.AdminController.AdminBlockUser);
router.get('/dashboard-stats', (0, auth_1.default)(client_1.UserRole.ADMIN), admin_controller_1.AdminController.getAdminDashboardStats);
exports.AdminRoutes = router;
