import { z } from 'zod';

export const couponValidation = {
  createCoupon: z.object({
    body: z.object({
      code: z.string().min(3, 'Coupon code must be at least 3 characters'),
      discount: z.number().min(0).max(100, 'Discount must be between 0 and 100'),
      startDate: z.string().transform(str => new Date(str)),
      endDate: z.string().transform(str => new Date(str)),
      usageLimit: z.number().optional()
    }).refine(data => {
      if (data.discount && data.discount > 100) {
          return false;
      }
      return true;
  }, {
      message: "Percentage discount cannot exceed 100%"
    })
  }),

  validateCoupon: z.object({
    body: z.object({
      code: z.string()
    })
  }),

  getCouponById: z.object({
    params: z.object({
      id: z.string().uuid('Invalid ID format')
    })
  }),

  updateCoupon: z.object({
    params: z.object({
      id: z.string().uuid('Invalid ID format')
    }),
    body: z.object({
      code: z.string().min(3).optional(),
      discount: z.number().min(0).max(100).optional(),
      startDate: z.string().transform(str => new Date(str)).optional(),
      endDate: z.string().transform(str => new Date(str)).optional(),
      isActive: z.boolean().optional(),
      usageLimit: z.number().optional()
    }).refine(data => {
      if (data.discount && data.discount > 100) {
          return false;
      }
      return true;
  }, {
      message: "Percentage discount cannot exceed 100%"
  }).refine(data => {
      if (data.startDate && data.endDate) {
          return data.startDate < data.endDate;
      }
      return true;
  }, {
      message: "Start date must be before end date"
  })
  }),

  deleteCoupon: z.object({
    params: z.object({
      id: z.string().uuid('Invalid ID format')
    })
  }),

  applyCoupon: z.object({
    params: z.object({
      paymentId: z.string().uuid('Invalid payment ID format')
    }),
    body: z.object({
      code: z.string()
    })
  }),

  removeCoupon: z.object({
    params: z.object({
      paymentId: z.string().uuid('Invalid payment ID format')
    })
  })
}; 