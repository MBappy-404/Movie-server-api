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

const validatePayment = catchAsync(async (req, res) => {
  const result = await PaymentService.validatePayment(req.query);
  if (result) {
    res.redirect(`${config.ssl.success_url}/success`);
  } else {
    res.redirect(`${config.ssl.failed_url}/failed`);
  }
});

export const PaymentController = {
  initPayment,
  validatePayment,
};
