import { UserStatus } from "@prisma/client";
import AppError from "../../errors/AppError";
import prisma from "../../helper/prisma";
import httpStatus from "http-status";

const UserBlockIntoDB = async (id: string) => {
  await prisma.user.findFirstOrThrow({
    where: { id },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const verifydata = await transactionClient.user.findFirst({
      where: { id },
    });
    if (verifydata?.status === "BLOCKED") {
      throw new AppError(httpStatus.BAD_REQUEST, "User already blocked");
    }

    await transactionClient.user.update({
      where: { id },
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
