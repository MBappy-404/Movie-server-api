import axios from "axios";
import httpStatus from "http-status";
import { IPaymentData } from "./ssl.interface";
import AppError from "../../errors/AppError";
import config from "../../config";

const initPayment = async (paymentData: IPaymentData) => {
  try {
    const data = {
      store_id: config.ssl.store_id,
      store_passwd: config.ssl.store_password,
      total_amount: paymentData.amount,
      currency: "BDT",
      tran_id: paymentData.transactionId, // use unique tran_id for each api call
      success_url: `${config.ssl.success_url}?tran_id=${paymentData.transactionId}`,
      fail_url: config.ssl.failed_url,
      cancel_url: config.ssl.cancel_url,
      ipn_url: "http://localhost:8000/api/ipn",
      shipping_method: "N/A",
      product_name: "Appointment",
      product_category: "Service",
      product_profile: "general",
      cus_name: paymentData.name,
      cus_email: paymentData.email,
      cus_add1: "Dhaka",
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "01711111111",
      cus_fax: "01711111111",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: 1000,
      ship_country: "N/A",
      purchaseStatus: paymentData.purchaseStatus,
      userId: paymentData.userId,
      contentId: paymentData.contentId,
    };

    const response = await axios({
      method: "post",
      url: config.ssl.payment_api,
      data: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data;
  } catch (err) {
    console.log(err);
    throw new AppError(httpStatus.BAD_REQUEST, "Payment erro occured!");
  }
};

const validatePayment = async (payload: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.ssl.validation_api}?val_id=${payload.val_id}&store_id=${config.ssl.store_id}&store_passwd=${config.ssl.store_password}&format=json`,
    });

    return response.data;
  } catch (err) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment validation failed!");
  }
};

export const SSLService = {
  initPayment,
  validatePayment,
};
