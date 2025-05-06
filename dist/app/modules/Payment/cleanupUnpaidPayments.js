"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../helper/prisma"));
const client_1 = require("@prisma/client");
const cleanupUnpaidPayments = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find all unpaid payments older than 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const unpaidPayments = yield prisma_1.default.payment.findMany({
            where: {
                status: client_1.PaymentStatus.UNPAID,
                createdAt: {
                    lt: twentyFourHoursAgo,
                },
            },
        });
        // Delete each unpaid payment
        for (const payment of unpaidPayments) {
            yield prisma_1.default.payment.delete({
                where: {
                    id: payment.id,
                },
            });
        }
        console.log(`Cleaned up ${unpaidPayments.length} unpaid payments`);
    }
    catch (error) {
        console.error("Error cleaning up unpaid payments:", error);
    }
});
exports.default = cleanupUnpaidPayments;
