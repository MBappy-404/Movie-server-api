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
exports.PaymentService = void 0;
const prisma_1 = __importDefault(require("../../helper/prisma"));
const ssl_service_1 = require("../SSL/ssl.service");
const client_1 = require("@prisma/client");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const sendEmail_1 = __importDefault(require("./sendEmail"));
const initPayment = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            id: user === null || user === void 0 ? void 0 : user.id,
        },
    });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    if ((userData === null || userData === void 0 ? void 0 : userData.status) === "BLOCKED") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `User is ${userData === null || userData === void 0 ? void 0 : userData.status}`);
    }
    const contentData = yield prisma_1.default.content.findUnique({
        where: {
            id: payload === null || payload === void 0 ? void 0 : payload.contentId,
            isAvailable: true,
        },
    });
    if (!contentData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Content not found!");
    }
    // Check for existing payment (both paid and unpaid)
    const existingPayment = yield prisma_1.default.payment.findUnique({
        where: {
            userId_contentId: {
                userId: userData === null || userData === void 0 ? void 0 : userData.id,
                contentId: contentData === null || contentData === void 0 ? void 0 : contentData.id,
            },
        },
        include: {
            user: true,
            content: true,
        },
    });
    // If payment exists and is PAID, throw error
    if (existingPayment && existingPayment.status === client_1.PaymentStatus.PAID) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Payment already made!");
    }
    // If payment exists and is UNPAID, delete it before creating new one
    if (existingPayment && existingPayment.status === client_1.PaymentStatus.UNPAID) {
        yield prisma_1.default.payment.delete({
            where: {
                id: existingPayment.id,
            },
        });
    }
    const trxId = `${userData === null || userData === void 0 ? void 0 : userData.id}-${contentData === null || contentData === void 0 ? void 0 : contentData.id}`;
    // Check for active discount
    const activeDiscount = yield prisma_1.default.discount.findFirst({
        where: {
            contentId: contentData.id,
            isActive: true,
            startDate: {
                lte: new Date(),
            },
            endDate: {
                gte: new Date(),
            },
        },
    });
    // Calculate the amount based on purchase status and apply discount if available
    let amount = payload.status === client_1.purchaseStatus.RENTED ? contentData.rentprice : contentData.price;
    const originalAmount = amount;
    if (activeDiscount) {
        const discountAmount = (amount * activeDiscount.percentage) / 100;
        amount = amount - discountAmount;
    }
    const paymentCreateData = {
        userId: userData.id,
        contentId: contentData.id,
        amount: amount,
        transactionId: trxId,
        status: client_1.PaymentStatus.UNPAID,
        purchaseStatus: payload.status,
        originalAmount: originalAmount,
        discountPercentage: (activeDiscount === null || activeDiscount === void 0 ? void 0 : activeDiscount.percentage) || 0,
    };
    const newPayment = yield prisma_1.default.payment.create({
        data: paymentCreateData,
    });
    const initPaymentData = {
        amount: newPayment.amount,
        transactionId: newPayment.transactionId,
        name: userData.name,
        email: userData.email,
        userId: userData.id,
        contentId: contentData.id,
        purchaseStatus: payload.status,
        originalAmount: originalAmount,
        discountPercentage: (activeDiscount === null || activeDiscount === void 0 ? void 0 : activeDiscount.percentage) || 0,
    };
    const result = yield ssl_service_1.SSLService.initPayment(initPaymentData);
    return {
        paymentUrl: result,
        paymentDetails: {
            amount: newPayment.amount,
            originalAmount: originalAmount,
            discountPercentage: (activeDiscount === null || activeDiscount === void 0 ? void 0 : activeDiscount.percentage) || 0,
            discountApplied: !!activeDiscount,
        },
    };
});
const removeUnpaidPayment = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield prisma_1.default.payment.findUnique({
        where: {
            id: paymentId,
        },
    });
    if (!payment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Payment not found!");
    }
    if (payment.status === client_1.PaymentStatus.PAID) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Cannot remove paid payment!");
    }
    // Delete the payment record
    yield prisma_1.default.payment.delete({
        where: {
            id: paymentId,
        },
    });
    return {};
});
const validatePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.tran_id) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Transaction id not found!");
    }
    const isPaymentExist = yield prisma_1.default.payment.findUnique({
        where: {
            transactionId: payload.tran_id,
        },
    });
    if (!isPaymentExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Payment not found!");
    }
    // Check if payment is unpaid and older than 24 hours
    if (isPaymentExist.status === client_1.PaymentStatus.UNPAID) {
        const paymentAge = Date.now() - isPaymentExist.createdAt.getTime();
        const hoursOld = paymentAge / (1000 * 60 * 60);
        if (hoursOld >= 24) {
            // Remove unpaid payment if it's older than 24 hours
            yield removeUnpaidPayment(isPaymentExist.id);
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Payment expired. Please try purchasing again.");
        }
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedPaymentData = yield tx.payment.update({
            where: {
                transactionId: payload.tran_id,
            },
            data: {
                status: client_1.PaymentStatus.PAID,
            },
        });
        const contentLinkData = yield tx.contentLinks.findFirst({
            where: {
                contentId: updatedPaymentData.contentId,
            },
        });
        if (!contentLinkData) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Content link not found!");
        }
        // Check if purchase record already exists
        const existingPurchase = yield tx.userPurchaseContents.findUnique({
            where: {
                userId_contentId: {
                    userId: updatedPaymentData.userId,
                    contentId: updatedPaymentData.contentId,
                },
            },
        });
        let purchaseData;
        if (existingPurchase) {
            // Update existing purchase record
            purchaseData = yield tx.userPurchaseContents.update({
                where: {
                    userId_contentId: {
                        userId: updatedPaymentData.userId,
                        contentId: updatedPaymentData.contentId,
                    },
                },
                data: {
                    movieLink: contentLinkData.contentLink,
                    status: updatedPaymentData.purchaseStatus,
                },
            });
        }
        else {
            // Create new purchase record
            purchaseData = yield tx.userPurchaseContents.create({
                data: {
                    userId: updatedPaymentData.userId,
                    contentId: updatedPaymentData.contentId,
                    movieLink: contentLinkData.contentLink,
                    status: updatedPaymentData.purchaseStatus,
                },
            });
        }
        return purchaseData;
    }));
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id: result.userId,
        },
    });
    yield (0, sendEmail_1.default)(user === null || user === void 0 ? void 0 : user.email, `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
  <p>Dear ${user === null || user === void 0 ? void 0 : user.name},</p>

  <p>Thank you for choosing our service! Your movie is ready to watch:</p>

  <p>
    <a href="${result.movieLink}" style="text-decoration: none;">
      <button style="
        background-color: #1e90ff;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
      ">
        Watch Movie
      </button>
    </a>
  </p>

  <p>Enjoy your movie!</p>
  <p>Best regards,<br/>The CineVerse Team</p>
</div>
    `);
    return isPaymentExist;
});
const getAllPayment = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.payment.findMany({
        include: {
            user: true,
            content: true,
        },
        orderBy: { createdAt: "desc" },
    });
    return result;
});
const getVerifyPayment = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.payment.findMany({
        where: {
            userId: user.id,
            transactionId: payload.tran_id
        },
        include: {
            user: true,
            content: true,
        },
    });
    return result;
});
exports.PaymentService = {
    initPayment,
    validatePayment,
    getAllPayment,
    getVerifyPayment,
    removeUnpaidPayment,
};
