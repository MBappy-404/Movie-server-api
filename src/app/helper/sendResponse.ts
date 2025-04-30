import { Response } from "express";

export const sendResponse = <T>(
  res: Response,
  data: {
    status: number;
    success: boolean;
    message: string;
    data?: T | null | undefined;
  }
) => {
  res.status(data?.status).json({
    success: data.success,
    message: data?.message,
    data: data?.data || null || undefined,
  });
};
