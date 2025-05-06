import { purchaseStatus } from "@prisma/client";

export type IPaymentData = {
  amount: number;
  transactionId: string;
  name: string;
  email: string;
  userId: string;
  contentId: string;
  purchaseStatus: purchaseStatus;
  originalAmount?: number;
  discountPercentage?: number;
};
