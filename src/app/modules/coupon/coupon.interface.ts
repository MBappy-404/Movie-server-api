import { Payment } from '@prisma/client';

export interface ICoupon {
  id: string;
  code: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
  createdAt: Date;
  updatedAt: Date;
  payments?: Payment[];
}

export interface ICreateCoupon {
  code: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
}

export interface IValidateCoupon {
  code: string;
  amount: number; // Total amount to calculate discount
} 