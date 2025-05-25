"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterValidation = void 0;
const zod_1 = require("zod");
exports.newsletterValidation = {
    subscribe: zod_1.z.object({
        body: zod_1.z.object({
            email: zod_1.z.string().email('Invalid email format')
        })
    }),
    unsubscribe: zod_1.z.object({
        params: zod_1.z.object({
            email: zod_1.z.string().email('Invalid email format')
        })
    })
};
