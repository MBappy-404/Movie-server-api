import z from 'zod';

const changePasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z.string({
            required_error: "Old password is required",
            invalid_type_error: "Old password must be a string"
        }),
        newPassword: z.string({
            required_error: "New password is required",
            invalid_type_error: "New password must be a string"
        }).min(4, "Password must be at least 4 characters")
    })
});

const resetPasswordSchema = z.object({
    body: z.object({
        email: z.string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string"
        }).email("Invalid email format"),
        newPassword: z.string({
            required_error: "New password is required",
            invalid_type_error: "New password must be a string"
        }).min(4, "Password must be at least 4 characters")
    })
});

export const authValidation = {
    changePasswordValidationSchema,
    resetPasswordSchema
}
