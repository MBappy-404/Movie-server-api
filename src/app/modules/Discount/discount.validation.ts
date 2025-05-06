import { z } from "zod";

const createDiscountSchema = z.object({
    body: z.object({
      contentId: z.string(),
      percentage: z.number().min(1).max(100),
      startDate: z.string(),
      endDate: z.string(),
    }),
  });
  
  const updateDiscountSchema = z.object({
    body: z.object({
      percentage: z.number().min(1).max(100).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      isActive: z.boolean().optional(),
    }),
  });
  

export const discountValidate = {
    createDiscountSchema,
    updateDiscountSchema,
}