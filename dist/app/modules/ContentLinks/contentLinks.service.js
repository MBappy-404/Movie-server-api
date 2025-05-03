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
exports.ContentLinksService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = __importDefault(require("../../helper/prisma"));
const http_status_1 = __importDefault(require("http-status"));
const createContentLinksIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.contentLinks.create({
        data: payload,
    });
    return result;
});
const getAllContentLinksFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.contentLinks.findMany({
        include: {
            content: true,
        },
    });
    return result;
});
const getSingleContentLinksFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.contentLinks.findUnique({
        where: {
            id,
        },
        include: {
            content: true,
        },
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "ContentLinks not found!");
    }
    return result;
});
const updateContentLinksIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isContentLinksExist = yield prisma_1.default.contentLinks.findUnique({
        where: {
            id,
        },
    });
    if (!isContentLinksExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "ContentLinks not found!");
    }
    const result = yield prisma_1.default.contentLinks.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteContentLinksFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isContentLinksExist = yield prisma_1.default.contentLinks.findUnique({
        where: {
            id,
        },
    });
    if (!isContentLinksExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "ContentLinks not found!");
    }
    const result = yield prisma_1.default.contentLinks.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.ContentLinksService = {
    createContentLinksIntoDB,
    getAllContentLinksFromDB,
    getSingleContentLinksFromDB,
    updateContentLinksIntoDB,
    deleteContentLinksFromDB,
};
