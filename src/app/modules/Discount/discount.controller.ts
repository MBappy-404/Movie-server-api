import { Request, Response } from "express";
import { DiscountService } from "./discount.service";
import { catchAsync } from "../../helper/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../helper/sendResponse";




const createDiscount = catchAsync(async (req: Request, res: Response) => {
  const result = await DiscountService.createDiscount(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Discount created successfully",
    data: result,
  });
});

const getAllDiscounts = catchAsync(async (req: Request, res: Response) => {
  const result = await DiscountService.getAllDiscounts();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Discounts retrieved successfully",
    data: result,
  });
});

const getActiveDiscounts = catchAsync(async (req: Request, res: Response) => {
  const result = await DiscountService.getActiveDiscounts();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Active discounts retrieved successfully",
    data: result,
  });
});

const getSingleDiscountById = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.params
  const result = await DiscountService.getSingleDiscoundById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single Discount retrieved successfully",
    data: result,
  });
});

const updateDiscount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DiscountService.updateDiscount(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Discount Update successfully",
    data: result,
  });
});

const deleteDiscount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await DiscountService.deleteDiscount(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Discount deleted successfully",
  });
});

export const DiscountController = {
  createDiscount,
  getAllDiscounts,
  getActiveDiscounts,
  updateDiscount,
  deleteDiscount,
  getSingleDiscountById
}; 