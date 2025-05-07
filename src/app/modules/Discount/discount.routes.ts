import express from "express";
import { DiscountController } from "./discount.controller";
import { z } from "zod";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { discountValidate } from "./discount.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(discountValidate.createDiscountSchema),
  DiscountController.createDiscount
);

router.get("/", auth(UserRole.ADMIN), DiscountController.getAllDiscounts);

router.get("/active", DiscountController.getActiveDiscounts);
router.get("/:id", DiscountController.getSingleDiscountById);

router.patch(
  "/:id",
  auth(UserRole.ADMIN),
  validateRequest(discountValidate.updateDiscountSchema),
  DiscountController.updateDiscount
);

router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  DiscountController.deleteDiscount
);

export const DiscountRoutes = router; 