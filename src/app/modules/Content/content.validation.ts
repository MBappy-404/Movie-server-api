import { z } from "zod";

const CreateContentValidationSchema = z.object({
  content: z.object({
    title: z.string({ required_error: "Title is required" }),
    releaseYear: z.string({ required_error: "Release year is required" }),
    duration: z.string({ required_error: "Duration is required" }),
    price: z.number({ required_error: "Price is required" }),
    rentprice: z.number({ required_error: "Rent Price is required" }),
    director: z.string({ required_error: "Director is required" }),
    spoilerWarning:  z.string({ required_error: "Spoiler Warning is required" }),
    contentBanner: z.string({ required_error: "Content Banner is required" }),
    producer: z.string({ required_error: "Producer is required" }),
    actor: z.string({ required_error: "Actor is required" }),
    actress: z.string({ required_error: "Actress is required" }),
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
      .optional(),
    releaseYear: z
      .string()
      .optional(),
    duration: z
      .string()
      .optional(),
    price: z
      .number()
      .optional(),
    director: z
      .string()
      .optional(),
    producer: z
      .string()
      .optional(),
    contentBanner: z
      .string()
      .optional(),
    actor: z
      .string()
      .optional(),
    actress: z
      .string()
      .optional(),
    spoilerWarning: z
      .string()
      .optional(),
    synopsis: z
      .string()
      .optional(),
    platformId: z
      .string()
      .optional(),
    genreId: z
      .string()
      .optional(),
    isAvailable: z
      .boolean()
      .optional(),
  }),
  contentLink: z
    .string()
    .optional(),
});

export const ContentValidation = {
  CreateContentValidationSchema,
  updateContentValidationSchema,
};
