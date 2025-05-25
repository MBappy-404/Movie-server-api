import { PrismaClient } from '@prisma/client';
import { ICoupon, ICreateCoupon, IValidateCoupon } from './coupon.interface';
import AppError from '../../errors/AppError';
import status from 'http-status';
import prisma from '../../helper/prisma';

const createCoupon = async (data: ICreateCoupon): Promise<ICoupon> => {
  try {
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: data.code }
    });

    if (existingCoupon) {
      throw new AppError(status.BAD_REQUEST, 'Coupon code already exists');
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: data.code,
        discount: data.discount,
        startDate: data.startDate,
        endDate: data.endDate,
        usageLimit: data.usageLimit || 100
      }
    });

    return coupon;
  } catch (error) {
    throw error;
  }
};

const validateCoupon = async (data: IValidateCoupon): Promise<{ coupon: ICoupon; discountedAmount: number }> => {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: data.code }
    });

    if (!coupon) {
      throw new AppError(status.BAD_REQUEST, 'Invalid coupon code');
    }

    if (!coupon.isActive) {
      throw new AppError(status.BAD_REQUEST, 'Coupon is inactive');
    }

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      throw new AppError(status.BAD_REQUEST, 'Coupon has expired');
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      throw new AppError(status.BAD_REQUEST, 'Coupon usage limit reached');
    }

    // Calculate discounted amount
    const discountAmount = (data.amount * coupon.discount) / 100;
    const discountedAmount = data.amount - discountAmount;

    return {
      coupon,
      discountedAmount
    };
  } catch (error) {
    throw error;
  }
};


const removeCouponFromPayment = async (paymentId: string): Promise<void> => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { coupon: true }
    });

    if (!payment) {
      throw new AppError(status.BAD_REQUEST, 'Payment not found');
    }

    if (!payment.couponId) {
      throw new AppError(status.BAD_REQUEST, 'No coupon applied to this payment');
    }

    // Update payment to remove coupon
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        couponId: null,
        amount: payment.originalAmount,
        discountPercentage: 0
      }
    });

    // Decrement coupon usage count
    if (payment.coupon) {
      await prisma.coupon.update({
        where: { id: payment.coupon.id },
        data: {
          usedCount: payment.coupon.usedCount - 1
        }
      });
    }
  } catch (error) {
    throw error;
  }
};

const getAllCoupons = async (): Promise<ICoupon[]> => {
  try {
    return await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    throw error;
  }
};

const getCouponById = async (id: string): Promise<ICoupon> => {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { id }
    });

    if (!coupon) {
      throw new AppError(status.BAD_REQUEST, 'Coupon not found');
    }

    return coupon;
  } catch (error) {
    throw error;
  }
};

const updateCoupon = async (id: string, data: Partial<ICreateCoupon>): Promise<ICoupon> => {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { id }
    });

    if (!coupon) {
      throw new AppError(status.BAD_REQUEST, 'Coupon not found');
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data
    });

    return updatedCoupon;
  } catch (error) {
    throw error;
  }
};

const deleteCoupon = async (id: string): Promise<void> => {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { id }
    });

    if (!coupon) {
      throw new AppError(status.BAD_REQUEST, 'Coupon not found');
    }

    await prisma.coupon.delete({
      where: { id }
    });
  } catch (error) {
    throw error;
  }
};

export const CouponServices = {
  createCoupon,
  validateCoupon,
  removeCouponFromPayment,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon
}; 