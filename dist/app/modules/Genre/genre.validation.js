"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreValidationSchemas = void 0;
const zod_1 = require("zod");
const createGenre = zod_1.z.object({
    body: zod_1.z.object({
        genreName: zod_1.z.string(),
    }),
});
exports.GenreValidationSchemas = {
    createGenre,
};
