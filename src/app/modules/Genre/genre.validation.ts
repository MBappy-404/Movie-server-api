import { z } from "zod";

const createGenre = z.object({
  body: z.object({
    genreName: z.string(),
  }),
});

const updateGenre = z.object({
  body: z.object({
    genreName: z.string().optional(),
  }),
});

export const GenreValidationSchemas = {
  createGenre,
  updateGenre
};
