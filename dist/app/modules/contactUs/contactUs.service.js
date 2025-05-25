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
exports.ContactUsService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../helper/prisma"));
const createContact = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingContact = yield prisma_1.default.contactUs.findUnique({
            where: { email: data.email }
        });
        if (existingContact) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'A contact form with this email already exists');
        }
        const contact = yield prisma_1.default.contactUs.create({
            data: {
                email: data.email,
                fullName: data.fullName,
                subject: data.subject,
                message: data.message
            }
        });
        return contact;
    }
    catch (error) {
        throw error;
    }
});
const getAllContacts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma_1.default.contactUs.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }
    catch (error) {
        throw error;
    }
});
const getContactById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contact = yield prisma_1.default.contactUs.findUnique({
            where: { id }
        });
        if (!contact) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Contact not found');
        }
        return contact;
    }
    catch (error) {
        throw error;
    }
});
const deleteContact = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contact = yield prisma_1.default.contactUs.findUnique({
            where: { id }
        });
        if (!contact) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Contact not found');
        }
        yield prisma_1.default.contactUs.delete({
            where: { id }
        });
    }
    catch (error) {
        throw error;
    }
});
exports.ContactUsService = {
    createContact,
    getAllContacts,
    getContactById,
    deleteContact
};
