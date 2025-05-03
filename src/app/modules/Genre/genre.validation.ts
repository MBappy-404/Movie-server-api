import { z } from "zod";

const createGenre = z.object({
  body: z.object({
    genreName: z.string(),
  }),
});

export const GenreValidationSchemas = {
  createGenre,
};
