"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post('/register', (0, validateRequest_1.default)(user_validation_1.UserValidation.createUserValidation), user_controller_1.UserController.RegisterUser);
router.get('/', (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.UserController.getAllUserData);
router.get('/:id', user_controller_1.UserController.getUserById);
router.patch('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), user_controller_1.UserController.UpdateUser);
router.delete('/:id', (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.UserController.DeleteUser);
exports.UserRoutes = router;
