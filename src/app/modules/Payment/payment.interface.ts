import { PaymentStatus, purchaseStatus } from "@prisma/client";

export type IPayment = {
  id: string;
  userId: string;
  contentId: string;
  purchaseStatus: purchaseStatus;
  amount: number;
  originalAmount: number;
  discountPercentage: number;
  discountId?: string;
  transactionId: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type IPaymentCreate = {
  userId: string;
  contentId: string;
  purchaseStatus: purchaseStatus;
  amount: number;
  originalAmount: number;
  discountPercentage: number;
  discountId?: string;
  transactionId: string;
  status: PaymentStatus;
}; 