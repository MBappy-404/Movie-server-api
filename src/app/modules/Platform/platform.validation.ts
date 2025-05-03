import { platform } from "os";
import { z } from "zod";

const createPlatformValidationSchema = z.object({
  platformName: z.string({ required_error: "Platform name is required" })
});

const updatePlatformValidationSchema = z.object({
  platformName: z.string({ required_error: "Platform name is required" }).optional()
});

export const platformValidations = {
  createPlatformValidationSchema,
  updatePlatformValidationSchema,
};
