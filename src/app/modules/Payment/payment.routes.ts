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
router.get("/", auth(UserRole.ADMIN), PaymentController.getAllPayment);

router.get("/", auth(UserRole.ADMIN), PaymentController.getAllPayment);

router.get("/", auth(UserRole.ADMIN), PaymentController.getAllPayment);

router.get("/my-purchase-history", auth(UserRole.USER, UserRole.ADMIN), PaymentController.getAllPayment);


router.post("/ipn", PaymentController.validatePayment);

export const PaymentRoutes = router;
