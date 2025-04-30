import { platform } from "os";
import { z } from "zod";

const createPlatformValidationSchema = z.object({
  body: z.object({
    platformName: z.string({ required_error: "Platform name is required" }),
    platformLogo: z
      .string({ required_error: "Platform logo is required" })
      .optional(),
  }),
});

const updatePlatformValidationSchema = z.object({
  body: z.object({
    platformName: z
      .string({ required_error: "Platform name is required" })
      .optional(),
    platformLogo: z
      .string({ required_error: "Platform logo is required" })
      .optional(),
  }),
});

export const platformValidations = {
  createPlatformValidationSchema,
  updatePlatformValidationSchema,
};
