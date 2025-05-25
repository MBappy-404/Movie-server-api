import { z } from "zod";

const createDiscountSchema = z.object({
    body: z.object({
      contentId: z.string(),
      percentage: z.number().min(1).max(100),
      startDate: z.string(),
      endDate: z.string(),
    }).refine(data => {
        if (data.percentage && data.percentage > 100) {
            return false;
        }
        return true;
    }, {
        message: "Percentage discount cannot exceed 100%"
    }),
  });
  
  const updateDiscountSchema = z.object({
    body: z.object({
      percentage: z.number().min(1).max(100).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      isActive: z.boolean().optional(),
    }).refine(data => {
        if (data.percentage && data.percentage > 100) {
            return false;
        }
        return true;
    }, {
        message: "Percentage discount cannot exceed 100%"
    }),
  });

export const discountValidate = {
    createDiscountSchema,
    updateDiscountSchema,
}