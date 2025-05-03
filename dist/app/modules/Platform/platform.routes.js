"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformRoutes = void 0;
const express_1 = __importDefault(require("express"));
const platform_controller_1 = require("./platform.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const platform_validation_1 = require("./platform.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(platform_validation_1.platformValidations.createPlatformValidationSchema), platform_controller_1.platformController.createPlaform);
router.get("/", platform_controller_1.platformController.getAllPlatforms);
router.get("/:id", platform_controller_1.platformController.getSinglePlatform);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(platform_validation_1.platformValidations.updatePlatformValidationSchema), platform_controller_1.platformController.updatePlatform);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), platform_controller_1.platformController.deletePlatform);
exports.PlatformRoutes = router;
