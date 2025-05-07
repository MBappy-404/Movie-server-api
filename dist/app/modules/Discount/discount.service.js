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
exports.DiscountService = void 0;
const prisma_1 = __importDefault(require("../../helper/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createDiscount = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if content exists
    const content = yield prisma_1.default.content.findUnique({
        where: { id: payload.contentId },
    });
    if (!content) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Content not found");
    }
    // Check if content already has an active discount
    const existingDiscount = yield prisma_1.default.discount.findUnique({
        where: { contentId: payload.contentId },
    });
    if (existingDiscount) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Content already has a discount");
    }
    // Validate percentage
    if (payload.percentage <= 0 || payload.percentage > 100) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Discount percentage must be between 1 and 100");
    }
    // Validate dates
    if (payload.startDate >= payload.endDate) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Start date must be before end date");
    }
    const result = yield prisma_1.default.discount.create({
        data: payload,
        include: {
            content: true,
        },
    });
    return result;
});
const getAllDiscounts = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.discount.findMany({
        include: {
            content: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
});
const getActiveDiscounts = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const result = yield prisma_1.default.discount.findMany({
        where: {
            isActive: true,
            startDate: {
                lte: now,
            },
            endDate: {
                gte: now,
            },
        },
        include: {
            content: {
                include: {
                    genre: true,
                    platform: true,
                    reviews: true
                }
            }
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
});
const getSingleDiscoundById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.discount.findUnique({
        where: { contentId: id }
    });
    return result;
});
const updateDiscount = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const discount = yield prisma_1.default.discount.findUnique({
        where: { id },
    });
    if (!discount) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Discount not found");
    }
    // Validate percentage if provided
    if (payload.percentage && (payload.percentage <= 0 || payload.percentage > 100)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Discount percentage must be between 1 and 100");
    }
    // Validate dates if provided
    if (payload.startDate && payload.endDate && payload.startDate >= payload.endDate) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Start date must be before end date");
    }
    const result = yield prisma_1.default.discount.update({
        where: { id },
        data: payload,
        include: {
            content: true,
        },
    });
    return result;
});
const deleteDiscount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const discount = yield prisma_1.default.discount.findUnique({
        where: { id },
    });
    if (!discount) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Discount not found");
    }
    yield prisma_1.default.discount.delete({
        where: { id },
    });
    return null;
});
const deactivateExpiredDiscounts = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    // Find all active discounts that have expired
    const expiredDiscounts = yield prisma_1.default.discount.findMany({
        where: {
            isActive: true,
            endDate: {
                lt: now
            }
        }
    });
    // Deactivate each expired discount
    for (const discount of expiredDiscounts) {
        yield prisma_1.default.discount.delete({
            where: {
                id: discount.id
            }
        });
    }
    return {
        message: `Deactivated ${expiredDiscounts.length} expired discounts`,
        deactivatedCount: expiredDiscounts.length
    };
});
exports.DiscountService = {
    createDiscount,
    getAllDiscounts,
    getActiveDiscounts,
    getSingleDiscoundById,
    updateDiscount,
    deleteDiscount,
    deactivateExpiredDiscounts
};
