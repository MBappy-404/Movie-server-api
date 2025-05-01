export interface IUserPurchaseContents {
  userId: string;
  contentId: string;
  status: "RENTED" | "BOUGHT";
}
