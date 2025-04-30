"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const changePasswordValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        oldPassword: zod_1.default.string({
            required_error: "Old password is required",
            invalid_type_error: "Old password must be a string"
        }),
        newPassword: zod_1.default.string({
            required_error: "New password is required",
            invalid_type_error: "New password must be a string"
        }).min(4, "Password must be at least 4 characters")
    })
});
const resetPasswordSchema = zod_1.default.object({
    body: zod_1.default.object({
        email: zod_1.default.string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string"
        }).email("Invalid email format"),
        newPassword: zod_1.default.string({
            required_error: "New password is required",
            invalid_type_error: "New password must be a string"
        }).min(4, "Password must be at least 4 characters")
    })
});
exports.authValidation = {
    changePasswordValidationSchema,
    resetPasswordSchema
};
