import { UserRole, UserStatus } from "@prisma/client";
import AppError from "../../errors/AppError";
import prisma from "../../helper/prisma";
import httpStatus from "http-status";

const UserBlockIntoDB = async (user: any) => {
  const verifyuser = await prisma.user.findFirst({
    where: { id: user.id, status: UserStatus.ACTIVE },
  });

  if(!verifyuser){
    throw new AppError(httpStatus.BAD_REQUEST, "User Not Found")
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    const verifydata = await transactionClient.user.findFirst({
      where: { id: user.id },
    });
    if (verifydata?.status === "BLOCKED") {
      throw new AppError(httpStatus.BAD_REQUEST, "User already blocked");
    }

    await transactionClient.user.update({
      where: { id: user.id },
      data: {
        status: UserStatus.BLOCKED,
      },
    });
  });

  return result;
};

const getAdminDashboardStats = async () => {
  const totalUser = await prisma.user.count();
  const totalMovies = await prisma.content.count();
  const totalPayment = await prisma.payment.count();
  const totalEaring = await prisma.payment.aggregate({_sum:{amount:true}});

  return {
    totalUser,
    totalMovies,
    totalPayment,
    totalEaring
  };
};

export const AdminService = {
  UserBlockIntoDB,
  getAdminDashboardStats,
};
