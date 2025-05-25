import { purchaseStatus } from "@prisma/client";

export type IUserPurchaseContents = {
  contentId: string;
  status: purchaseStatus;
  couponCode?: string;
};
