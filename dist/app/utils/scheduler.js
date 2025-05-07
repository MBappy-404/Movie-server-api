"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discount_service_1 = require("../modules/Discount/discount.service");
const cleanupUnpaidPayments_1 = __importDefault(require("./cleanupUnpaidPayments"));
// Run cleanup every hour
const SCHEDULE_INTERVAL = 10 * 1000; // 10 minute in milliseconds
const startScheduler = () => {
    console.log("Starting schedulers...");
    // Run payment cleanup immediately on startup
    (0, cleanupUnpaidPayments_1.default)();
    // Run discount deactivation immediately on startup
    discount_service_1.DiscountService.deactivateExpiredDiscounts();
    // Schedule payment cleanup to run every hour
    setInterval(cleanupUnpaidPayments_1.default, SCHEDULE_INTERVAL);
    // Schedule discount deactivation to run every hour
    setInterval(discount_service_1.DiscountService.deactivateExpiredDiscounts, SCHEDULE_INTERVAL);
};
exports.default = startScheduler;
