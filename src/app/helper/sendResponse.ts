import { Response } from "express";

export const sendResponse = <T>(
  res: Response,
  data: {
    statusCode: number;
    success: boolean;
    message: string;
    data?: T | null | undefined;
  }
) => {
  res.status(data?.statusCode).json({
    success: data.success,
    message: data?.message,
    data: data?.data || null || undefined,
  });
};
