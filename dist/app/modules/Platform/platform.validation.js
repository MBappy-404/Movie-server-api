"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.platformValidations = void 0;
const zod_1 = require("zod");
const createPlatformValidationSchema = zod_1.z.object({
    platformName: zod_1.z.string({ required_error: "Platform name is required" })
});
const updatePlatformValidationSchema = zod_1.z.object({
    platformName: zod_1.z.string({ required_error: "Platform name is required" }).optional()
});
exports.platformValidations = {
    createPlatformValidationSchema,
    updatePlatformValidationSchema,
};
