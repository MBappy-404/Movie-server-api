"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
router.post('/login', auth_controller_1.AuthController.LoginUser);
router.post('/refreshtoken', (0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), auth_controller_1.AuthController.refreshToken);
router.post('/reset-password', (0, validateRequest_1.default)(auth_validation_1.authValidation.resetPasswordSchema), auth_controller_1.AuthController.resetPassword);
router.post('/logout', auth_controller_1.AuthController.logout);
exports.AuthRoutes = router;
