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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../helper/prisma"));
const bcrypt = __importStar(require("bcrypt"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const generateToken_1 = __importDefault(require("../../utils/generateToken"));
const config_1 = __importDefault(require("../../config"));
const verifyToken_1 = __importDefault(require("../../utils/verifyToken"));
const loginUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const incorrectPassword = yield bcrypt.compare(payload.password, userData === null || userData === void 0 ? void 0 : userData.password);
    if (!incorrectPassword) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Password is incorrect");
    }
    const jwtPayloadData = {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        status: userData.status
    };
    const accessToken = (0, generateToken_1.default)(jwtPayloadData, config_1.default.jwt.jwt_access_secret, config_1.default.jwt.jwt_access_expires_in);
    const refreshToken = (0, generateToken_1.default)(jwtPayloadData, config_1.default.jwt.jwt_refresh_secret, config_1.default.jwt.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken
    };
});
const refreshTokenIntoDB = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (0, verifyToken_1.default)(token, config_1.default.jwt.jwt_refresh_secret);
    const { email } = decoded;
    const userData = yield prisma_1.default.user.findFirstOrThrow({
        where: { email }
    });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is blocked
    const userStatus = userData.status === "BLOCKED";
    if (userStatus === true) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked ! !');
    }
    const jwtPayloadData = {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        status: userData.status
    };
    const accessToken = (0, generateToken_1.default)(jwtPayloadData, config_1.default.jwt.jwt_access_secret, config_1.default.jwt.jwt_access_expires_in);
    return {
        accessToken
    };
});
const LogoutIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return null;
});
const resetPasswordIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const hashedPassword = yield bcrypt.hash(payload.newPassword, 12);
    yield prisma_1.default.user.update({
        where: {
            email: payload.email
        },
        data: {
            password: hashedPassword
        }
    });
    return null;
});
exports.AuthService = {
    loginUserIntoDB,
    refreshTokenIntoDB,
    LogoutIntoDB,
    resetPasswordIntoDB
};
