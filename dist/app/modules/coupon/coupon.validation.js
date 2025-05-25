"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponValidation = void 0;
const zod_1 = require("zod");
exports.couponValidation = {
    createCoupon: zod_1.z.object({
        body: zod_1.z.object({
            code: zod_1.z.string().min(3, 'Coupon code must be at least 3 characters'),
            discount: zod_1.z.number().min(0).max(100, 'Discount must be between 0 and 100'),
            startDate: zod_1.z.string().transform(str => new Date(str)),
            endDate: zod_1.z.string().transform(str => new Date(str)),
            usageLimit: zod_1.z.number().optional()
        }).refine(data => {
            if (data.discount && data.discount > 100) {
                return false;
            }
            return true;
        }, {
            message: "Percentage discount cannot exceed 100%"
        })
    }),
    validateCoupon: zod_1.z.object({
        body: zod_1.z.object({
            code: zod_1.z.string()
        })
    }),
    getCouponById: zod_1.z.object({
        params: zod_1.z.object({
            id: zod_1.z.string().uuid('Invalid ID format')
        })
    }),
    updateCoupon: zod_1.z.object({
        params: zod_1.z.object({
            id: zod_1.z.string().uuid('Invalid ID format')
        }),
        body: zod_1.z.object({
            code: zod_1.z.string().min(3).optional(),
            discount: zod_1.z.number().min(0).max(100).optional(),
            startDate: zod_1.z.string().transform(str => new Date(str)).optional(),
            endDate: zod_1.z.string().transform(str => new Date(str)).optional(),
            isActive: zod_1.z.boolean().optional(),
            usageLimit: zod_1.z.number().optional()
        }).refine(data => {
            if (data.discount && data.discount > 100) {
                return false;
            }
            return true;
        }, {
            message: "Percentage discount cannot exceed 100%"
        }).refine(data => {
            if (data.startDate && data.endDate) {
                return data.startDate < data.endDate;
            }
            return true;
        }, {
            message: "Start date must be before end date"
        })
    }),
    deleteCoupon: zod_1.z.object({
        params: zod_1.z.object({
            id: zod_1.z.string().uuid('Invalid ID format')
        })
    }),
    applyCoupon: zod_1.z.object({
        params: zod_1.z.object({
            paymentId: zod_1.z.string().uuid('Invalid payment ID format')
        }),
        body: zod_1.z.object({
            code: zod_1.z.string()
        })
    }),
    removeCoupon: zod_1.z.object({
        params: zod_1.z.object({
            paymentId: zod_1.z.string().uuid('Invalid payment ID format')
        })
    })
};
