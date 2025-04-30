"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const createUserValidation = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string({ required_error: "Name is reqired" }),
        email: zod_1.default.string({ required_error: "Email is reqired" }),
        password: zod_1.default.string({ required_error: "Password is reqired" }),
        contactNumber: zod_1.default.string({ required_error: "Contact Number is reqired" })
    })
});
exports.UserValidation = {
    createUserValidation
};
