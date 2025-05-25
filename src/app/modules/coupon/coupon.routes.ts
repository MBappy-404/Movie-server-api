import { Router } from 'express';
import { CouponController } from './coupon.controller';
import { couponValidation } from './coupon.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.post(
  '/',
  auth(UserRole.ADMIN),
  validateRequest(couponValidation.createCoupon),
  CouponController.createCoupon
);

router.post(
  '/validate',
  validateRequest(couponValidation.validateCoupon),
  CouponController.validateCoupon
);

router.get(
  '/',
  auth(UserRole.ADMIN),
  CouponController.getAllCoupons
);

router.get(
  '/:id',
  auth(UserRole.ADMIN),
  CouponController.getCouponById
);

router.patch(
  '/:id',
  auth(UserRole.ADMIN),
  CouponController.updateCoupon
);

router.delete(
  '/:id',
  auth(UserRole.ADMIN),
  CouponController.deleteCoupon
);


export const CouponRoutes = router;