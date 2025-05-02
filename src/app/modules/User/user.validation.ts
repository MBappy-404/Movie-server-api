import z  from "zod";


const createUserValidation = z.object({
    name: z.string({ required_error: "Name is reqired" }),
    email: z.string({ required_error: "Email is reqired" }),
    password: z.string({ required_error: "Password is reqired" }),
    contactNumber: z.string({ required_error: "Contact Number is reqired" })
})


const updateUserValidation = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    contactNumber: z.string().optional(),
    role: z.string().optional(),
})

export const UserValidation = {
    createUserValidation,
    updateUserValidation
}

