import prisma from "../../helper/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createDiscount = async (payload: {
  contentId: string;
  percentage: number;
  startDate: Date;
  endDate: Date;
}) => {
  // Check if content exists
  const content = await prisma.content.findUnique({
    where: { id: payload.contentId },
  });

  if (!content) {
    throw new AppError(httpStatus.NOT_FOUND, "Content not found");
  }

  // Check if content already has an active discount
  const existingDiscount = await prisma.discount.findUnique({
    where: { contentId: payload.contentId },
  });

  if (existingDiscount) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Content already has a discount"
    );
  }

  // Validate percentage
  if (payload.percentage <= 0 || payload.percentage > 100) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Discount percentage must be between 1 and 100"
    );
  }

  // Validate dates
  if (payload.startDate >= payload.endDate) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Start date must be before end date"
    );
  }

  const result = await prisma.discount.create({
    data: payload,
    include: {
      content: true,
    },
  });

  return result;
};

const getAllDiscounts = async () => {
  const result = await prisma.discount.findMany({
    include: {
      content: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getActiveDiscounts = async () => {
  const now = new Date();
  const result = await prisma.discount.findMany({
    where: {
      isActive: true,
      startDate: {
        lte: now,
      },
      endDate: {
        gte: now,
      },
    },
    include: {
      content:{
        include:{
          genre: true,
          platform: true,
          reviews: true
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};


const getSingleDiscoundById = async(id: string)=> {
  const result = await prisma.discount.findUnique({
    where: {contentId: id}
  })

  return result
}

const updateDiscount = async (
  id: string,
  payload: Partial<{
    percentage: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  }>
) => {
  const discount = await prisma.discount.findUnique({
    where: { id },
  });

  if (!discount) {
    throw new AppError(httpStatus.NOT_FOUND, "Discount not found");
  }

  // Validate percentage if provided
  if (payload.percentage && (payload.percentage <= 0 || payload.percentage > 100)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Discount percentage must be between 1 and 100"
    );
  }

  // Validate dates if provided
  if (payload.startDate && payload.endDate && payload.startDate >= payload.endDate) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Start date must be before end date"
    );
  }

  const result = await prisma.discount.update({
    where: { id },
    data: payload,
    include: {
      content: true,
    },
  });

  return result;
};

const deleteDiscount = async (id: string) => {
  const discount = await prisma.discount.findUnique({
    where: { id },
  });

  if (!discount) {
    throw new AppError(httpStatus.NOT_FOUND, "Discount not found");
  }

  await prisma.discount.delete({
    where: { id },
  });

  return null;
};

const deactivateExpiredDiscounts = async () => {
  const now = new Date();
  
  // Find all active discounts that have expired
  const expiredDiscounts = await prisma.discount.findMany({
    where: {
      isActive: true,
      endDate: {
        lt: now
      }
    }
  });

  // Deactivate each expired discount
  for (const discount of expiredDiscounts) {
    await prisma.discount.update({
      where: {
        id: discount.id
      },
      data: {
        isActive: false
      }
    });
  }

  return {
    message: `Deactivated ${expiredDiscounts.length} expired discounts`,
    deactivatedCount: expiredDiscounts.length
  };
};

export const DiscountService = {
  createDiscount,
  getAllDiscounts,
  getActiveDiscounts,
  getSingleDiscoundById,
  updateDiscount,
  deleteDiscount,
  deactivateExpiredDiscounts
}; 