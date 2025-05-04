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
exports.GenreServices = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = __importDefault(require("../../helper/prisma"));
const http_status_1 = __importDefault(require("http-status"));
const createGenreIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.genre.create({
        data: payload,
    });
    return result;
});
const getAllGenreFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.genre.findMany();
    return result;
});
const updateUpdateFromDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const genreverify = yield prisma_1.default.genre.findFirst({
        where: {
            id,
        },
    });
    if (!genreverify) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Genre Not Found");
    }
    const result = yield prisma_1.default.genre.update({
        where: { id },
        data: payload
    });
    return result;
});
const deleteGenreFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.genre.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const contentsInfo = yield tx.content.deleteMany({
            where: {
                genreId: id,
            },
        });
        yield tx.genre.delete({
            where: {
                id,
            },
        });
    }));
    return result;
});
exports.GenreServices = {
    createGenreIntoDB,
    getAllGenreFromDB,
    deleteGenreFromDB,
    updateUpdateFromDB
};
