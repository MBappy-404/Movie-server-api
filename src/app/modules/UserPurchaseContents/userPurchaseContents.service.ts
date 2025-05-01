import prisma from "../../helper/prisma";
import { IUserPurchaseContents } from "./userPurchaseContents.interface";

const getAllUserPurchaseContentsFromDB = async () => {
  const result = await prisma.userPurchaseContents.findMany({
    include: {
      content: true,
      user: true,
    },
  });
  return result;
};

const getMyPurchaseContentsFromDB = async (userId: string) => {
  const result = await prisma.userPurchaseContents.findMany({
    where: {
      userId,
    },
    include: {
      content: true,
      user: true,
    },
  });
  return result;
};

export const UserPurchaseContentsService = {
  getAllUserPurchaseContentsFromDB,
  getMyPurchaseContentsFromDB,
};
