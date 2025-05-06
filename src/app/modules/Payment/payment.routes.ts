import express from "express";
import { PaymentController } from "./payment.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/init-payment",
  auth(UserRole.USER, UserRole.ADMIN),
  PaymentController.initPayment
);
router.get("/", auth(UserRole.ADMIN), PaymentController.getAllPayment);

router.get("/verify-payment", auth(UserRole.USER, UserRole.ADMIN), PaymentController.getVerifyPayment);

router.post("/ipn", PaymentController.validatePayment);

// Add route to remove unpaid payment
router.delete(
  "/remove-unpaid/:paymentId",
  auth(UserRole.USER, UserRole.ADMIN),
  PaymentController.removeUnpaidPayment
);

export const PaymentRoutes = router;
