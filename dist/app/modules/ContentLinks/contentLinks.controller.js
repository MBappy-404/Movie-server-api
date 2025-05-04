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
exports.ContentLinksController = void 0;
const catchAsync_1 = require("../../helper/catchAsync");
const sendResponse_1 = __importDefault(require("../../helper/sendResponse"));
const contentLinks_service_1 = require("./contentLinks.service");
const http_status_1 = __importDefault(require("http-status"));
const createContentLinksIntoDB = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contentLinks_service_1.ContentLinksService.createContentLinksIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "ContentLinks created successfully",
        data: result,
    });
}));
const getAllContentLinksFromDB = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contentLinks_service_1.ContentLinksService.getAllContentLinksFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "ContentLinks retrieved successfully! ",
        data: result,
    });
}));
const getSingleContentLinksFromDB = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield contentLinks_service_1.ContentLinksService.getSingleContentLinksFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "ContentLinks retrieved successfully",
        data: result,
    });
}));
const updateContentLinksIntoDB = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield contentLinks_service_1.ContentLinksService.updateContentLinksIntoDB(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "ContentLinks updated successfully",
        data: result,
    });
}));
const deleteContentLinksFromDB = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield contentLinks_service_1.ContentLinksService.deleteContentLinksFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "ContentLinks deleted successfully",
        data: result,
    });
}));
exports.ContentLinksController = {
    createContentLinksIntoDB,
    getAllContentLinksFromDB,
    getSingleContentLinksFromDB,
    updateContentLinksIntoDB,
    deleteContentLinksFromDB,
};
