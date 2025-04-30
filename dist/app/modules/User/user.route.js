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
const router = express_1.default.Router();
router.post('/register', (0, validateRequest_1.default)(user_validation_1.UserValidation.createUserValidation), user_controller_1.UserController.RegisterUser);
router.get('/', user_controller_1.UserController.getAllUserData);
router.get('/:id', user_controller_1.UserController.getUserById);
router.patch('/:id', user_controller_1.UserController.UpdateUser);
router.delete('/:id', user_controller_1.UserController.DeleteUser);
exports.UserRoutes = router;
