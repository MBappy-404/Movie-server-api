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
exports.ContentServices = void 0;
const prisma_1 = __importDefault(require("../../helper/prisma"));
const paginationHelper_1 = require("../../helper/paginationHelper");
const fileUploader_1 = require("../../helper/fileUploader");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createContentIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const datainfo = req.body;
    if (file) {
        const uploadData = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
        req.body.content.thumbnail = uploadData === null || uploadData === void 0 ? void 0 : uploadData.secure_url;
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const data = datainfo.content;
        const content = yield tx.content.create({
            data: Object.assign({}, data),
        });
        yield tx.contentLinks.create({
            data: {
                contentId: content.id,
                contentLink: datainfo.contentLink,
            },
        });
        return content;
    }));
    return result;
});
const getSingleContentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.content.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma_1.default.content.findUnique({
        where: {
            id,
        },
        include: {
            genre: true,
            platform: true,
            reviews: {
                include: {
                    _count: {
                        select: { like: true },
                    }
                },
            },
        },
    });
    return result;
});
const deleteSingleContentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.content.findUniqueOrThrow({
        where: {
            id,
        },
    });
    yield prisma_1.default.content.delete({
        where: {
            id,
        },
    });
});
const getAllFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm, genre, platform } = params, filterData = __rest(params, ["searchTerm", "genre", "platform"]);
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            OR: [
                { title: { contains: searchTerm, mode: "insensitive" } },
                { synopsis: { contains: searchTerm, mode: "insensitive" } },
                { releaseYear: { contains: searchTerm, mode: "insensitive" } },
                { genre: { genreName: { contains: searchTerm, mode: "insensitive" } } },
                {
                    platform: {
                        platformName: { contains: searchTerm, mode: "insensitive" },
                    },
                },
                { director: { contains: searchTerm, mode: "insensitive" } },
                { actor: { contains: searchTerm, mode: "insensitive" } },
                { actress: { contains: searchTerm, mode: "insensitive" } },
            ],
        });
    }
    if (genre && genre.length > 0) {
        andCondition.push({
            genre: {
                genreName: {
                    contains: genre,
                    mode: "insensitive",
                },
            },
        });
    }
    if (platform && platform.length > 0) {
        andCondition.push({
            platform: {
                platformName: {
                    contains: platform,
                    mode: "insensitive",
                },
            },
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    let orderBy = { createdAt: "desc" }; // default
    if (options.sortBy) {
        const sortOrder = ((_a = options.sortOrder) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "asc" ? "asc" : "desc";
        switch (options.sortBy) {
            case "rating":
                // Sort by average rating from reviews
                const contents = yield prisma_1.default.content.findMany({
                    where: whereConditions,
                    include: {
                        reviews: {
                            select: {
                                rating: true,
                            },
                        },
                    },
                });
                const contentsWithAvgRating = contents.map((content) => (Object.assign(Object.assign({}, content), { averageRating: content.reviews.length > 0
                        ? content.reviews.reduce((acc, review) => acc + review.rating, 0) / content.reviews.length
                        : 0 })));
                contentsWithAvgRating.sort((a, b) => sortOrder === "asc"
                    ? a.averageRating - b.averageRating
                    : b.averageRating - a.averageRating);
                return {
                    meta: {
                        page,
                        limit,
                        total: contents.length,
                    },
                    data: contentsWithAvgRating.slice(skip, skip + limit),
                };
            case "reviews":
                // Sort by number of reviews
                const contentsWithReviewCount = yield prisma_1.default.content.findMany({
                    where: whereConditions,
                    include: {
                        _count: {
                            select: { reviews: true },
                        },
                    },
                    orderBy: {
                        reviews: {
                            _count: sortOrder,
                        },
                    },
                    skip,
                    take: limit,
                });
                const total = yield prisma_1.default.content.count({
                    where: whereConditions,
                });
                return {
                    meta: {
                        page,
                        limit,
                        total,
                    },
                    data: contentsWithReviewCount,
                };
            case "latest":
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(endDate.getDate() - 7);
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);
                andCondition.push({
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                });
                orderBy = { createdAt: sortOrder };
                break;
            case "title":
                orderBy = { title: sortOrder };
                break;
            case "price":
                orderBy = { price: sortOrder };
                break;
            case "releaseYear":
                orderBy = { releaseYear: sortOrder };
                break;
        }
    }
    const result = yield prisma_1.default.content.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy,
        include: {
            genre: true,
            platform: true,
            reviews: {
                include: {
                    comment: true,
                    like: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.content.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const updateContentIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const file = req.file;
    if (file) {
        const uploadData = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
        req.body.content.thumbnail = uploadData === null || uploadData === void 0 ? void 0 : uploadData.secure_url;
    }
    const verifycontent = yield prisma_1.default.content.findUnique({
        where: { id }
    });
    if (!verifycontent) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Content is not found!!");
    }
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Update content
        const updatedContent = yield tx.content.update({
            where: { id },
            data: req.body.content
        });
        // Update content link if provided
        if (req.body.contentLink) {
            const contentLink = yield tx.contentLinks.findFirst({
                where: { contentId: id }
            });
            if (contentLink) {
                yield tx.contentLinks.update({
                    where: { id: contentLink.id },
                    data: { contentLink: req.body.contentLink }
                });
            }
            else {
                yield tx.contentLinks.create({
                    data: {
                        contentId: id,
                        contentLink: req.body.contentLink
                    }
                });
            }
        }
        return updatedContent;
    }));
    return result;
});
// const searchAndFilterContent = async (query: {
//   searchTerm?: string;
//   genre?: string;
//   director?: string;
//   cast?: string;
//   platform?: string;
//   releaseYear?: string;
//   ratingRange?: { min?: number; max?: number };
//   sortBy?: 'rating' | 'reviews' | 'latest';
//   page?: number;
//   limit?: number;
// }) => {
//   const {
//     searchTerm,
//     genre,
//     director,
//     cast,
//     platform,
//     releaseYear,
//     ratingRange,
//     sortBy = 'latest',
//     page = 1,
//     limit = 10,
//   } = query;
//   const parsedPage = Number(page);
//   const parsedLimit = Number(limit);
//   const skip = (parsedPage - 1) * parsedLimit;
//   console.log(typeof parsedPage, typeof parsedLimit);
//   const where: any = {};
//   if (searchTerm) {
//     where.OR = [
//       { title: { contains: searchTerm, mode: 'insensitive' } },
//       { synopsis: { contains: searchTerm, mode: 'insensitive' } },
//       { genre: { contains: searchTerm, mode: 'insensitive' } },
//     ];
//   }
//   if (genre) {
//     where.genre = {
//       genreName: { equals: genre, mode: 'insensitive' },
//     };
//   }
//   if (director) {
//     where.director = { contains: director, mode: 'insensitive' };
//   }
//   if (cast) {
//     where.OR = [
//       { actor: { contains: cast, mode: 'insensitive' } },
//       { actress: { contains: cast, mode: 'insensitive' } },
//     ];
//   }
//   if (platform) {
//     where.platform = {
//       platformName: { equals: platform, mode: 'insensitive' },
//     };
//   }
//   if (releaseYear) {
//     where.releaseYear = releaseYear;
//   }
//   if (ratingRange) {
//     where.price = {
//       ...(ratingRange.min !== undefined && { gte: ratingRange.min }),
//       ...(ratingRange.max !== undefined && { lte: ratingRange.max }),
//     };
//   }
//   const orderBy: any = {};
//   switch (sortBy) {
//     case 'rating':
//       // Assuming we'll add a reviewCount field later
//       orderBy.price = 'desc';
//       break;
//     case 'reviews':
//       // Assuming we'll add a reviewCount field later
//       orderBy.createdAt = 'desc';
//       break;
//     case 'latest':
//     default:
//       orderBy.createdAt = 'desc';
//       break;
//   }
//   const [contents, total] = await Promise.all([
//     prisma.content.findMany({
//       where,
//       orderBy,
//       skip,
//       take: parsedLimit,
//       include: {
//         genre: true,
//       },
//     }),
//     prisma.content.count({ where }),
//   ]);
//   return {
//     contents,
//     meta: {
//       total,
//       page: parsedPage,
//       limit: parsedLimit,
//       totalPages: Math.ceil(total / parsedLimit),
//     },
//   };
// };
exports.ContentServices = {
    createContentIntoDB,
    getSingleContentFromDB,
    deleteSingleContentFromDB,
    getAllFromDB,
    updateContentIntoDB
};
