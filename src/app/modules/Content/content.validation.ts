import { z } from "zod";

const CreateContentValidationSchema = z.object({
    content: z.object({
        title: z.string({ required_error: "Title is required" }),
        releaseYear: z.string({ required_error: "Release year is required" }),
        duration: z.string({ required_error: "Duration is required" }),
        price: z.number({ required_error: "Price is required" }),
        director: z.string({ required_error: "Director is required" }),
        producer: z.string({ required_error: "Producer is required" }),
        actor: z.string({ required_error: "Actor is required" }),
        actress: z.string({ required_error: "Actress is required" }),
        spoilerWarning: z.string({ required_error: "Spoiler warning is required" }),
        synopsis: z.string({ required_error: "Synopsis is required" }),
        platformId: z.string({ required_error: "Platform ID is required" }),
        genreId: z.string({ required_error: "Genre ID is required" }),
      }),
      contentLink: z.string({ required_error: "Content link is required" }),
});

const updateContentValidationSchema = z.object({
    content: z.object({
        title: z
          .string()
          .min(1, "Title cannot be empty")
          .optional(),
        releaseYear: z
          .string()
          .regex(/^\d{4}$/, "Release year must be a 4-digit year")
          .optional(),
        duration: z
          .string()
          .regex(/^\d+h \d+m$/, "Duration must be in the format 'Xh Ym'")
          .optional(),
        price: z
          .number()
          .positive("Price must be a positive number")
          .optional(),
        director: z
          .string()
          .min(1, "Director name cannot be empty")
          .optional(),
        producer: z
          .string()
          .min(1, "Producer name cannot be empty")
          .optional(),
        actor: z
          .string()
          .min(1, "Actor name cannot be empty")
          .optional(),
        actress: z
          .string()
          .min(1, "Actress name cannot be empty")
          .optional(),
        spoilerWarning: z
          .string()
          .min(1, "Spoiler warning cannot be empty")
          .optional(),
        synopsis: z
          .string()
          .min(10, "Synopsis must be at least 10 characters long")
          .optional(),
        platformId: z
          .string()
          .uuid("Platform ID must be a valid UUID")
          .optional(),
        genreId: z
          .string()
          .uuid("Genre ID must be a valid UUID")
          .optional(),
      }),
      contentLink: z
        .string()
        .url("Content link must be a valid URL")
        .optional(),
});

export const ContentValidation = {
    CreateContentValidationSchema,
    updateContentValidationSchema,
};
