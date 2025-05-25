"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactUsRoutes = void 0;
const express_1 = require("express");
const contactUs_validation_1 = require("./contactUs.validation");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const contactUs_controller_1 = require("./contactUs.controller");
const router = (0, express_1.Router)();
router.post('/', (0, validateRequest_1.default)(contactUs_validation_1.contactUsValidation.createContact), contactUs_controller_1.ContactUsController.createContact);
router.get('/', contactUs_controller_1.ContactUsController.getAllContacts);
router.get('/:id', (0, validateRequest_1.default)(contactUs_validation_1.contactUsValidation.getContactById), contactUs_controller_1.ContactUsController.getContactById);
router.delete('/:id', contactUs_controller_1.ContactUsController.deleteContact);
exports.ContactUsRoutes = router;
