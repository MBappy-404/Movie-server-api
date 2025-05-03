"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSLService = void 0;
const axios_1 = __importDefault(require("axios"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const config_1 = __importDefault(require("../../config"));
const initPayment = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {
            store_id: config_1.default.ssl.store_id,
            store_passwd: config_1.default.ssl.store_password,
            total_amount: paymentData.amount,
            currency: "BDT",
            tran_id: paymentData.transactionId, // use unique tran_id for each api call
            success_url: `${config_1.default.ssl.success_url}?tran_id=${paymentData.transactionId}`,
            fail_url: config_1.default.ssl.failed_url,
            cancel_url: config_1.default.ssl.cancel_url,
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
        const response = yield (0, axios_1.default)({
            method: "post",
            url: config_1.default.ssl.payment_api,
            data: data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        return response.data;
    }
    catch (err) {
        console.log(err);
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Payment erro occured!");
    }
});
const validatePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, axios_1.default)({
            method: "GET",
            url: `${config_1.default.ssl.validation_api}?val_id=${payload.val_id}&store_id=${config_1.default.ssl.store_id}&store_passwd=${config_1.default.ssl.store_password}&format=json`,
        });
        return response.data;
    }
    catch (err) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Payment validation failed!");
    }
});
exports.SSLService = {
    initPayment,
    validatePayment,
};
