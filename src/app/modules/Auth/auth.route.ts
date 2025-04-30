
import express from "express";
import { AuthController } from "./auth.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { authValidation } from "./auth.validation";

const router = express.Router()

router.post('/login', AuthController.LoginUser)
router.post('/refreshtoken', auth(UserRole.USER, UserRole.ADMIN), AuthController.refreshToken)
router.post('/reset-password', validateRequest(authValidation.resetPasswordSchema), AuthController.resetPassword)

export const AuthRoutes = router