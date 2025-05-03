"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformRoutes = void 0;
const express_1 = __importDefault(require("express"));
const platform_controller_1 = require("./platform.controller");
const platform_validation_1 = require("./platform.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../helper/fileUploader");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.ADMIN), fileUploader_1.FileUploader.upload.single('file'), (req, res, next) => {
    req.body = platform_validation_1.platformValidations.createPlatformValidationSchema.parse(JSON.parse(req.body.data));
    return platform_controller_1.platformController.createPlaform(req, res, next);
});
router.get("/", platform_controller_1.platformController.getAllPlatforms);
router.get("/:id", platform_controller_1.platformController.getSinglePlatform);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), fileUploader_1.FileUploader.upload.single('file'), (req, res, next) => {
    req.body = platform_validation_1.platformValidations.updatePlatformValidationSchema.parse(JSON.parse(req.body.data));
    return platform_controller_1.platformController.updatePlatform(req, res, next);
});
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), platform_controller_1.platformController.deletePlatform);
exports.PlatformRoutes = router;
