"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterRoutes = void 0;
const express_1 = require("express");
const newsletter_controller_1 = require("./newsletter.controller");
const newsletter_validation_1 = require("./newsletter.validation");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const router = (0, express_1.Router)();
router.post('/subscribe', (0, validateRequest_1.default)(newsletter_validation_1.newsletterValidation.subscribe), newsletter_controller_1.NewsletterController.createSubscribe);
router.delete('/unsubscribe/:email', (0, validateRequest_1.default)(newsletter_validation_1.newsletterValidation.unsubscribe), newsletter_controller_1.NewsletterController.unsubscribe);
router.get('/subscribers', newsletter_controller_1.NewsletterController.getAllSubscribers);
exports.NewsletterRoutes = router;
