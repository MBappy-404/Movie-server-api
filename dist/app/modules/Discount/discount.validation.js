"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discountValidate = void 0;
const zod_1 = require("zod");
const createDiscountSchema = zod_1.z.object({
    body: zod_1.z.object({
        contentId: zod_1.z.string(),
        percentage: zod_1.z.number().min(1).max(100),
        startDate: zod_1.z.string(),
        endDate: zod_1.z.string(),
    }),
});
const updateDiscountSchema = zod_1.z.object({
    body: zod_1.z.object({
        percentage: zod_1.z.number().min(1).max(100).optional(),
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.discountValidate = {
    createDiscountSchema,
    updateDiscountSchema,
};
