"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const content_controller_1 = require("./content.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../helper/fileUploader");
const content_validation_1 = require("./content.validation");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.ADMIN), fileUploader_1.FileUploader.upload.single('file'), (req, res, next) => {
    req.body = content_validation_1.ContentValidation.CreateContentValidationSchema.parse(JSON.parse(req.body.data));
    return content_controller_1.ContentController.createContent(req, res, next);
});
router.get("/", content_controller_1.ContentController.getAllContentData);
router.get("/:id", content_controller_1.ContentController.getSingleContent);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), content_controller_1.ContentController.deleteSingleContent);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), fileUploader_1.FileUploader.upload.single('file'), (req, res, next) => {
    req.body = content_validation_1.ContentValidation.updateContentValidationSchema.parse(JSON.parse(req.body.data));
    return content_controller_1.ContentController.updateContent(req, res, next);
});
exports.ContentRoutes = router;
