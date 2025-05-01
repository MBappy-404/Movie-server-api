import { catchAsync } from "../../helper/catchAsync";
import sendResponse from "../../helper/sendResponse";
import { PaymentService } from "./payment.service";
import httpStatus from "http-status";

const initPayment = catchAsync(async (req, res) => {
  const result = await PaymentService.initPayment(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment initiate successfully",
    data: result,
  });
});

const validatePayment = catchAsync(async (req, res) => {
  const result = await PaymentService.validatePayment(req.query);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment validate successfully",
    data: result,
  });
});

export const PaymentController = {
  initPayment,
  validatePayment,
};
