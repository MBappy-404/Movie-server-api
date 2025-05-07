import prisma from "../helper/prisma";
import { PaymentStatus } from "@prisma/client";

const cleanupUnpaidPayments = async () => {
  try {
    // Find all unpaid payments older than 1 hours
    const twentyFourHoursAgo = new Date(Date.now() - 60 * 60 * 1000);

    const unpaidPayments = await prisma.payment.findMany({
      where: {
        status: PaymentStatus.UNPAID,
        createdAt: {
          lt: twentyFourHoursAgo,
        },
      },
    });

    // Delete each unpaid payment
    for (const payment of unpaidPayments) {
      await prisma.payment.delete({
        where: {
          id: payment.id,
        },
      });
    }

    console.log(`Cleaned up ${unpaidPayments.length} unpaid payments`);
  } catch (error) {
    console.error("Error cleaning up unpaid payments:", error);
  }
};

export default cleanupUnpaidPayments; 