"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler_1 = require("./app/middleware/globalErrorHandler");
// middlewares 
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send("Movie server is running");
});
// app.use("/api", appRouter);
app.use(globalErrorHandler_1.globalErrorHandler);
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: "Api Not Found",
        error: {
            path: req.originalUrl,
            message: "Your request path is not found"
        }
    });
});
exports.default = app; // Export the app instance for use in server.ts
