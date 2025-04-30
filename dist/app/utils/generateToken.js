"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (jwtPayload, secret, expiresIn) => {
    const options = { expiresIn };
    const token = jsonwebtoken_1.default.sign(jwtPayload, secret, options);
    return token;
};
exports.default = generateToken;
