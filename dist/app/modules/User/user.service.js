"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../helper/paginationHelper");
const prisma_1 = __importDefault(require("../../helper/prisma"));
const user_constant_1 = require("./user.constant");
const bcrypt = __importStar(require("bcrypt"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const fileUploader_1 = require("../../helper/fileUploader");
const UserRegisterIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadData = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
        req.body.profilePhoto = uploadData === null || uploadData === void 0 ? void 0 : uploadData.secure_url;
    }
    const hashedPassword = yield bcrypt.hash(req.body.password, 12); //  hash password
    req.body.password = hashedPassword;
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const verifyUser = yield tx.user.findFirst({
            where: {
                email: req.body.email
            }
        });
        if (verifyUser) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "User already Created");
        }
        const createUser = prisma_1.default.user.create({
            data: req.body
        });
        return createUser;
    }));
    return result;
});
const getAllFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondition = [];
    if (params.searchTerm) {
        andCondition.push({
            OR: user_constant_1.userSearchAbleFields.map(filed => ({
                [filed]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    const whereConditons = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.user.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });
    const total = yield prisma_1.default.user.count({
        where: whereConditons,
    });
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
});
const getUserByIdIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const verify = yield prisma_1.default.user.findUnique({
        where: { id }
    });
    if (!verify) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User Not found!');
    }
    const result = yield prisma_1.default.user.findUnique({
        where: { id }
    });
    return result;
});
const deleteUserIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.user.findUniqueOrThrow({
        where: { id }
    });
    const result = yield prisma_1.default.user.delete({
        where: { id }
    });
    return result;
});
const updateUserIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const file = req.file;
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const verifyUser = yield tx.user.findUniqueOrThrow({
            where: { id, status: client_1.UserStatus.ACTIVE }
        });
        if (file) {
            const uploadData = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
            req.body.profilePhoto = uploadData === null || uploadData === void 0 ? void 0 : uploadData.secure_url;
        }
        const update = yield prisma_1.default.user.update({
            where: { id, email: verifyUser.email },
            data: req.body
        });
        return update;
    }));
    return result;
});
exports.UserServices = {
    UserRegisterIntoDB,
    getAllFromDB,
    getUserByIdIntoDB,
    deleteUserIntoDB,
    updateUserIntoDB
};
