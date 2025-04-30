"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler = (error, req, res, next) => {
    res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
        success: false,
        status: 404,
        message: error.message || "Something went wrong",
        stack: error.stack,
    });
};
exports.globalErrorHandler = globalErrorHandler;
