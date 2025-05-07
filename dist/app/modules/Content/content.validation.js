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
        rentprice: zod_1.z.number({ required_error: "Rent Price is required" }),
        director: zod_1.z.string({ required_error: "Director is required" }),
        spoilerWarning: zod_1.z.string({ required_error: "Spoiler Warning is required" }),
        contentBanner: zod_1.z.string({ required_error: "Content Banner is required" }),
        producer: zod_1.z.string({ required_error: "Producer is required" }),
        actor: zod_1.z.string({ required_error: "Actor is required" }),
        actress: zod_1.z.string({ required_error: "Actress is required" }),
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
            .optional(),
        releaseYear: zod_1.z
            .string()
            .optional(),
        duration: zod_1.z
            .string()
            .optional(),
        price: zod_1.z
            .number()
            .optional(),
        director: zod_1.z
            .string()
            .optional(),
        producer: zod_1.z
            .string()
            .optional(),
        contentBanner: zod_1.z
            .string()
            .optional(),
        actor: zod_1.z
            .string()
            .optional(),
        actress: zod_1.z
            .string()
            .optional(),
        spoilerWarning: zod_1.z
            .string()
            .optional(),
        synopsis: zod_1.z
            .string()
            .optional(),
        platformId: zod_1.z
            .string()
            .optional(),
        genreId: zod_1.z
            .string()
            .optional(),
        isAvailable: zod_1.z
            .boolean()
            .optional(),
    }),
    contentLink: zod_1.z
        .string()
        .optional(),
});
exports.ContentValidation = {
    CreateContentValidationSchema,
    updateContentValidationSchema,
};
