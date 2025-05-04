import prisma from "../../helper/prisma";
import { SSLService } from "../SSL/ssl.service";
import { PaymentStatus, purchaseStatus } from "@prisma/client";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { IUserPurchaseContents } from "../UserPurchaseContents/userPurchaseContents.interface";
import emailSender from "./sendEmail";

const initPayment = async (payload: IUserPurchaseContents, user: any) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
  });

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }
  if (userData?.status === "BLOCKED") {
    throw new AppError(httpStatus.BAD_REQUEST, `User is ${userData?.status}`);
  }

  const contentData = await prisma.content.findUnique({
    where: {
      id: payload?.contentId,
      isAvailable: true,
    },
  });

  if (!contentData) {
    throw new AppError(httpStatus.NOT_FOUND, "Content not found!");
  }

  const paymentData = await prisma.payment.findUnique({
    where: {
      userId_contentId: {
        userId: userData?.id,
        contentId: contentData?.id,
      },
    },
    include: {
      user: true,
      content: true,
    },
  });

  if (paymentData) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment already made!");
  }

  const trxId = `${userData?.id}-${contentData?.id}`;

  // Determine the amount based on purchase status
  const amount = payload.status === purchaseStatus.RENTED ? contentData.rentprice : contentData.price;

  const newPayment = await prisma.payment.create({
    data: {
      userId: userData.id,
      contentId: contentData.id,
      amount: amount,
      transactionId: trxId,
      status: PaymentStatus.UNPAID,
      purchaseStatus: payload.status,
    },
  });

  const initPaymentData = {
    amount: newPayment.amount,
    transactionId: newPayment.transactionId,
    name: userData.name,
    email: userData.email,
    userId: userData.id,
    contentId: contentData.id,
    purchaseStatus: payload.status,
  };

  const result = await SSLService.initPayment(initPaymentData);
  return {
    paymentUrl: result,
  };
};

const validatePayment = async (payload: { tran_id?: string }) => {
  if (!payload.tran_id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Transaction id not found!");
  }

  const isPaymentExist = await prisma.payment.findUnique({
    where: {
      transactionId: payload.tran_id,
    },
  });

  if (!isPaymentExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found!");
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedPaymentData = await tx.payment.update({
      where: {
        transactionId: payload.tran_id,
      },
      data: {
        status: PaymentStatus.PAID,
      },
    });

    const contentLinkData = await tx.contentLinks.findFirst({
      where: {
        contentId: updatedPaymentData.contentId,
      },
    });

    if (!contentLinkData) {
      throw new AppError(httpStatus.NOT_FOUND, "Content link not found!");
    }

    // Check if purchase record already exists
    const existingPurchase = await tx.userPurchaseContents.findUnique({
      where: {
        userId_contentId: {
          userId: updatedPaymentData.userId,
          contentId: updatedPaymentData.contentId,
        },
      },
    });

    let purchaseData;
    if (existingPurchase) {
      // Update existing purchase record
      purchaseData = await tx.userPurchaseContents.update({
        where: {
          userId_contentId: {
            userId: updatedPaymentData.userId,
            contentId: updatedPaymentData.contentId,
          },
        },
        data: {
          movieLink: contentLinkData.contentLink,
          status: updatedPaymentData.purchaseStatus,
        },
      });
    } else {
      // Create new purchase record
      purchaseData = await tx.userPurchaseContents.create({
        data: {
          userId: updatedPaymentData.userId,
          contentId: updatedPaymentData.contentId,
          movieLink: contentLinkData.contentLink,
          status: updatedPaymentData.purchaseStatus,
        },
      });
    }

    return purchaseData;
  });

  const user = await prisma.user.findUnique({
    where: {
      id: result.userId,
    },
  });

  await emailSender(
    user?.email as string,
    `
    <div>
        <p>Dear ${user?.name},</p> </br>
        <p>Here is your Movie 
            <a href=${result.movieLink}>
                <button>
                    Watch Movie
                </button>
            </a>
        </p>
    </div>
    `
  );

  return true;
};

export const PaymentService = {
  initPayment,
  validatePayment,
};
