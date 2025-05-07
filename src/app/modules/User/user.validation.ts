import { UserStatus } from "@prisma/client";
import z from "zod";


const createUserValidation = z.object({
    name: z.string({ required_error: "Name is reqired" }),
    email: z.string({ required_error: "Email is reqired" }),
    password: z.string({ required_error: "Password is reqired" }),
    role: z.string().optional(),
    contactNumber: z.string({ required_error: "Contact Number is reqired" })
})


const updateUserValidation = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    contactNumber: z.string().optional(),
    role: z.string().optional(),
    status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED]).optional()
})

export const UserValidation = {
    createUserValidation,
    updateUserValidation
}

