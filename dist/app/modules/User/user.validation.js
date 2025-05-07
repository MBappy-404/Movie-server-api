"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const createUserValidation = zod_1.default.object({
    name: zod_1.default.string({ required_error: "Name is reqired" }),
    email: zod_1.default.string({ required_error: "Email is reqired" }),
    password: zod_1.default.string({ required_error: "Password is reqired" }),
    role: zod_1.default.string().optional(),
    contactNumber: zod_1.default.string({ required_error: "Contact Number is reqired" })
});
const updateUserValidation = zod_1.default.object({
    name: zod_1.default.string().optional(),
    email: zod_1.default.string().optional(),
    contactNumber: zod_1.default.string().optional(),
    role: zod_1.default.string().optional(),
    status: zod_1.default.enum([client_1.UserStatus.ACTIVE, client_1.UserStatus.BLOCKED, client_1.UserStatus.DELETED]).optional()
});
exports.UserValidation = {
    createUserValidation,
    updateUserValidation
};
