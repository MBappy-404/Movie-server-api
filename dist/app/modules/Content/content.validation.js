"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentValidation = void 0;
const zod_1 = require("zod");
const CreateContentValidationSchema = zod_1.z.object({
    content: zod_1.z.object({
        title: zod_1.z.string({ required_error: "Title is required" }),
        releaseYear: zod_1.z.string({ required_error: "Release year is required" }),
        duration: zod_1.z.string({ required_error: "Duration is required" }),
        price: zod_1.z.number({ required_error: "Price is required" }),
        director: zod_1.z.string({ required_error: "Director is required" }),
        producer: zod_1.z.string({ required_error: "Producer is required" }),
        actor: zod_1.z.string({ required_error: "Actor is required" }),
        actress: zod_1.z.string({ required_error: "Actress is required" }),
        spoilerWarning: zod_1.z.string({ required_error: "Spoiler warning is required" }),
        synopsis: zod_1.z.string({ required_error: "Synopsis is required" }),
        platformId: zod_1.z.string({ required_error: "Platform ID is required" }),
        genreId: zod_1.z.string({ required_error: "Genre ID is required" }),
    }),
    contentLink: zod_1.z.string({ required_error: "Content link is required" }),
});
const updateContentValidationSchema = zod_1.z.object({
    content: zod_1.z.object({
        title: zod_1.z
            .string()
            .min(1, "Title cannot be empty")
            .optional(),
        releaseYear: zod_1.z
            .string()
            .regex(/^\d{4}$/, "Release year must be a 4-digit year")
            .optional(),
        duration: zod_1.z
            .string()
            .regex(/^\d+h \d+m$/, "Duration must be in the format 'Xh Ym'")
            .optional(),
        price: zod_1.z
            .number()
            .positive("Price must be a positive number")
            .optional(),
        director: zod_1.z
            .string()
            .min(1, "Director name cannot be empty")
            .optional(),
        producer: zod_1.z
            .string()
            .min(1, "Producer name cannot be empty")
            .optional(),
        actor: zod_1.z
            .string()
            .min(1, "Actor name cannot be empty")
            .optional(),
        actress: zod_1.z
            .string()
            .min(1, "Actress name cannot be empty")
            .optional(),
        spoilerWarning: zod_1.z
            .string()
            .min(1, "Spoiler warning cannot be empty")
            .optional(),
        synopsis: zod_1.z
            .string()
            .min(10, "Synopsis must be at least 10 characters long")
            .optional(),
        platformId: zod_1.z
            .string()
            .uuid("Platform ID must be a valid UUID")
            .optional(),
        genreId: zod_1.z
            .string()
            .uuid("Genre ID must be a valid UUID")
            .optional(),
    }),
    contentLink: zod_1.z
        .string()
        .url("Content link must be a valid URL")
        .optional(),
});
exports.ContentValidation = {
    CreateContentValidationSchema,
    updateContentValidationSchema,
};
