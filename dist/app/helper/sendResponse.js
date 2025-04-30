"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, data) => {
    res.status(data === null || data === void 0 ? void 0 : data.status).json({
        success: data.success,
        message: data === null || data === void 0 ? void 0 : data.message,
        data: (data === null || data === void 0 ? void 0 : data.data) || null || undefined,
    });
};
exports.sendResponse = sendResponse;
