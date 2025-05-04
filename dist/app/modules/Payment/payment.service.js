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
    const paymentData = yield prisma_1.default.payment.findUnique({
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
    if (paymentData) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Payment already made!");
    }
    const trxId = `${userData === null || userData === void 0 ? void 0 : userData.id}-${contentData === null || contentData === void 0 ? void 0 : contentData.id}`;
    // Determine the amount based on purchase status
    const amount = payload.status === client_1.purchaseStatus.RENTED ? contentData.rentprice : contentData.price;
    const newPayment = yield prisma_1.default.payment.create({
        data: {
            userId: userData.id,
            contentId: contentData.id,
            amount: amount,
            transactionId: trxId,
            status: client_1.PaymentStatus.UNPAID,
            purchaseStatus: payload.status,
        },
    });
    const initPaymentData = {
        amount: newPayment.amount,
        transactionId: newPayment.transactionId,
        name: userData.name,
        email: userData.email,
        userId: userData.id,
        contentId: contentData.id,
        purchaseStatus: payload.status,
    };
    const result = yield ssl_service_1.SSLService.initPayment(initPaymentData);
    return {
        paymentUrl: result,
    };
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
    <div>
        <p>Dear ${user === null || user === void 0 ? void 0 : user.name},</p> </br>
        <p>Here is your Movie 
            <a href=${result.movieLink}>
                <button>
                    Watch Movie
                </button>
            </a>
        </p>
    </div>
    `);
    return true;
});
exports.PaymentService = {
    initPayment,
    validatePayment,
};
