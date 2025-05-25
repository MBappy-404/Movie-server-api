import { z } from 'zod';

export const newsletterValidation = {
  subscribe: z.object({
    body: z.object({
      email: z.string().email('Invalid email format')
    })
  }),

  unsubscribe: z.object({
    params: z.object({
      email: z.string().email('Invalid email format')
    })
  })
}; 