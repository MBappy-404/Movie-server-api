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
exports.platformService = void 0;
const prisma_1 = __importDefault(require("../../helper/prisma"));
const fileUploader_1 = require("../../helper/fileUploader");
const createPlatfromIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadData = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
        req.body.platformLogo = uploadData === null || uploadData === void 0 ? void 0 : uploadData.secure_url;
    }
    const result = yield prisma_1.default.platform.create({
        data: req.body,
    });
    return result;
});
const getAllPlatformsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.platform.findMany();
    return result;
});
const getSinglePlatformFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.platform.findUniqueOrThrow({
        where: {
            id,
        },
    });
    return result;
});
const updatePlatformIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma_1.default.platform.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const file = req.file;
    if (file) {
        const uploadData = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
        req.body.platformLogo = uploadData === null || uploadData === void 0 ? void 0 : uploadData.secure_url;
    }
    const result = yield prisma_1.default.platform.update({
        where: {
            id,
        },
        data: req.body,
    });
    return result;
});
const deletePlatformFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.platform.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.platformService = {
    createPlatfromIntoDB,
    getAllPlatformsFromDB,
    getSinglePlatformFromDB,
    updatePlatformIntoDB,
    deletePlatformFromDB,
};
