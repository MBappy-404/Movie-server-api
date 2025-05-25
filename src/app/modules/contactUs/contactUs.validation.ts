import { z } from 'zod';

export const contactUsValidation = {
  createContact: z.object({
    body: z.object({
      email: z.string().email('Invalid email format'),
      fullName: z.string().min(2, 'Full name must be at least 2 characters'),
      subject: z.string().min(5, 'Subject must be at least 5 characters'),
      message: z.string().min(10, 'Message must be at least 10 characters')
    })
  }),

  getContactById: z.object({
    params: z.object({
      id: z.string().uuid('Invalid ID format')
    })
  })
}; 