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
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const catchAsync_1 = require("../helper/catchAsync");
const verifyToken_1 = __importDefault(require("../utils/verifyToken"));
const config_1 = __importDefault(require("../config"));
const auth = (...roles) => {
    return (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let token = null;
        // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        //   token = req.headers.authorization.split(" ")[1];
        // }
        // // without Bearer 
        token = req.headers.authorization;
        // checking if the token is missing
        if (!token) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not Authorized");
        }
        // checking if the given token is valid
        const decoded = yield (0, verifyToken_1.default)(token, config_1.default.jwt.jwt_access_secret);
        const role = decoded.role;
        if (roles && !roles.includes(role)) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not Authorized");
        }
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
