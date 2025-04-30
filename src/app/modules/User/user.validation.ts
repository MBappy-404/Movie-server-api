import z  from "zod";


const createUserValidation = z.object({
    body: z.object({
        name: z.string({ required_error: "Name is reqired" }),
        email: z.string({ required_error: "Email is reqired" }),
        password: z.string({ required_error: "Password is reqired" }),
        contactNumber: z.string({ required_error: "Contact Number is reqired" })
    })
})

export const UserValidation = {
    createUserValidation
}

