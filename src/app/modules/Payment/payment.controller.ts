import config from "../../config";
import { catchAsync } from "../../helper/catchAsync";
import sendResponse from "../../helper/sendResponse";
import { PaymentService } from "./payment.service";
import httpStatus from "http-status";

const initPayment = catchAsync(async (req, res) => {
  const result = await PaymentService.initPayment(req.body, req.user);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment initiate successfully",
    data: result,
  });
});

const getAllPayment = catchAsync(async (req, res) => {
  const result = await PaymentService.getAllPayment();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment fetched successfully",
    data: result,
  });
});


const getVerifyPayment = catchAsync(async (req, res) => {
  const result = await PaymentService.getVerifyPayment(req.user, req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My Payment fetched successfully",
    data: result,
  });
});

const validatePayment = catchAsync(async (req, res) => {
  const result = await PaymentService.validatePayment(req.query);
  if (result) {
    res.redirect(`${config.ssl.success_url}/success?tran_id=${result.transactionId}`);
  } else {
    res.redirect(`${config.ssl.failed_url}/failed`);
  }
});

export const PaymentController = {
  initPayment,
  validatePayment,
  getAllPayment,
  getVerifyPayment
};
