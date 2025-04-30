import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status";
export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    status: 404,
    message: error.message || "Something went wrong",
    stack: error.stack,
  });
};
