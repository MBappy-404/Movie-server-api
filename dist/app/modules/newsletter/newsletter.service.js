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
exports.NewsletterService = void 0;
const client_1 = require("@prisma/client");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const prisma = new client_1.PrismaClient();
const createSubscribe = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingSubscriber = yield prisma.newsletter.findUnique({
            where: { email: data.email }
        });
        if (existingSubscriber) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Email already subscribed');
        }
        const subscriber = yield prisma.newsletter.create({
            data: {
                email: data.email
            }
        });
        return subscriber;
    }
    catch (error) {
        throw error;
    }
});
const unsubscribe = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscriber = yield prisma.newsletter.findUnique({
            where: { email }
        });
        if (!subscriber) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Email not found in subscribers list');
        }
        yield prisma.newsletter.delete({
            where: { email }
        });
    }
    catch (error) {
        throw error;
    }
});
const getAllSubscribers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.newsletter.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }
    catch (error) {
        throw error;
    }
});
exports.NewsletterService = {
    createSubscribe,
    unsubscribe,
    getAllSubscribers
};
