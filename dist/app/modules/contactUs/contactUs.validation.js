"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactUsValidation = void 0;
const zod_1 = require("zod");
exports.contactUsValidation = {
    createContact: zod_1.z.object({
        body: zod_1.z.object({
            email: zod_1.z.string().email('Invalid email format'),
            fullName: zod_1.z.string().min(2, 'Full name must be at least 2 characters'),
            subject: zod_1.z.string().min(5, 'Subject must be at least 5 characters'),
            message: zod_1.z.string().min(10, 'Message must be at least 10 characters')
        })
    }),
    getContactById: zod_1.z.object({
        params: zod_1.z.object({
            id: zod_1.z.string().uuid('Invalid ID format')
        })
    })
};
