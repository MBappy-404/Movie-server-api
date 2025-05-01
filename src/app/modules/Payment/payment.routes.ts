import express from "express";
import { PaymentController } from "./payment.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/init-payment",
  auth(UserRole.USER),
  PaymentController.initPayment
);

router.post("/ipn", auth(UserRole.USER), PaymentController.validatePayment);

export const PaymentRoutes = router;
