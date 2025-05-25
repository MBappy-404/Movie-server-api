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
exports.CouponServices = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../helper/prisma"));
const createCoupon = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingCoupon = yield prisma_1.default.coupon.findUnique({
            where: { code: data.code }
        });
        if (existingCoupon) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon code already exists');
        }
        const coupon = yield prisma_1.default.coupon.create({
            data: {
                code: data.code,
                discount: data.discount,
                startDate: data.startDate,
                endDate: data.endDate,
                usageLimit: data.usageLimit || 100
            }
        });
        return coupon;
    }
    catch (error) {
        throw error;
    }
});
const validateCoupon = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coupon = yield prisma_1.default.coupon.findUnique({
            where: { code: data.code }
        });
        if (!coupon) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid coupon code');
        }
        if (!coupon.isActive) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon is inactive');
        }
        const now = new Date();
        if (now < coupon.startDate || now > coupon.endDate) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon has expired');
        }
        if (coupon.usedCount >= coupon.usageLimit) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon usage limit reached');
        }
        // Calculate discounted amount
        const discountAmount = (data.amount * coupon.discount) / 100;
        const discountedAmount = data.amount - discountAmount;
        return {
            coupon,
            discountedAmount
        };
    }
    catch (error) {
        throw error;
    }
});
const removeCouponFromPayment = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payment = yield prisma_1.default.payment.findUnique({
            where: { id: paymentId },
            include: { coupon: true }
        });
        if (!payment) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Payment not found');
        }
        if (!payment.couponId) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'No coupon applied to this payment');
        }
        // Update payment to remove coupon
        yield prisma_1.default.payment.update({
            where: { id: paymentId },
            data: {
                couponId: null,
                amount: payment.originalAmount,
                discountPercentage: 0
            }
        });
        // Decrement coupon usage count
        if (payment.coupon) {
            yield prisma_1.default.coupon.update({
                where: { id: payment.coupon.id },
                data: {
                    usedCount: payment.coupon.usedCount - 1
                }
            });
        }
    }
    catch (error) {
        throw error;
    }
});
const getAllCoupons = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma_1.default.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }
    catch (error) {
        throw error;
    }
});
const getCouponById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coupon = yield prisma_1.default.coupon.findUnique({
            where: { id }
        });
        if (!coupon) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon not found');
        }
        return coupon;
    }
    catch (error) {
        throw error;
    }
});
const updateCoupon = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coupon = yield prisma_1.default.coupon.findUnique({
            where: { id }
        });
        if (!coupon) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon not found');
        }
        const updatedCoupon = yield prisma_1.default.coupon.update({
            where: { id },
            data
        });
        return updatedCoupon;
    }
    catch (error) {
        throw error;
    }
});
const deleteCoupon = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coupon = yield prisma_1.default.coupon.findUnique({
            where: { id }
        });
        if (!coupon) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Coupon not found');
        }
        yield prisma_1.default.coupon.delete({
            where: { id }
        });
    }
    catch (error) {
        throw error;
    }
});
exports.CouponServices = {
    createCoupon,
    validateCoupon,
    removeCouponFromPayment,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon
};
