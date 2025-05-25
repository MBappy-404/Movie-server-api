import { Request, Response } from 'express';
import { catchAsync } from '../../helper/catchAsync';
import sendResponse from '../../helper/sendResponse';
import status from 'http-status';
import { CouponServices } from './coupon.service';

const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const coupon = await CouponServices.createCoupon(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Coupon created successfully',
    data: coupon
  });
});

const validateCoupon = catchAsync(async (req: Request, res: Response) => {
  const coupon = await CouponServices.validateCoupon(req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Coupon is valid',
    data: coupon
  });
});


const removeCouponFromPayment = catchAsync(async (req: Request, res: Response) => {
  const { paymentId } = req.params;
  
  await CouponServices.removeCouponFromPayment(paymentId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Coupon removed successfully from payment'
  });
});

const getAllCoupons = catchAsync(async (req: Request, res: Response) => {
  const coupons = await CouponServices.getAllCoupons();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Coupons retrieved successfully',
    data: coupons
  });
});

const getCouponById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const coupon = await CouponServices.getCouponById(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Coupon retrieved successfully',
    data: coupon
  });
});

const updateCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const coupon = await CouponServices.updateCoupon(id, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Coupon updated successfully',
    data: coupon
  });
});

const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await CouponServices.deleteCoupon(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Coupon deleted successfully'
  });
});

export const CouponController = {
  createCoupon,
  validateCoupon,
  removeCouponFromPayment,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon
}; 