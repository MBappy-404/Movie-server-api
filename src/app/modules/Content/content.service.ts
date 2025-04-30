import { Prisma } from "@prisma/client";
import prisma from "../../helper/prisma";
import { IPaginationOptions } from "../../interface/pagination.type";
import { paginationHelper } from "../../helper/paginationHelper";
import { contentSearchAbleFields } from "./content.constant";

const createContentIntoDB = async (payload: any) => {
  const result = await prisma.content.create({
    data: payload,
  });

  return result;
};

const getSingleContentFromDB = async (id: string) => {
  await prisma.content.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.content.findUnique({
    where: {
      id,
    },
  });

  return result;
};

const deleteSingleContentFromDB = async (id: string) => {
  await prisma.content.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.content.delete({
    where: {
      id,
    },
  });
};

const getAllFromDB = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, genre, platform, ...filterData } = params;

  const andCondition: Prisma.ContentWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { synopsis: { contains: searchTerm, mode: 'insensitive' } },
        { genre: { genreName: { contains: searchTerm, mode: 'insensitive' } } },
        { platform: { platformName: { contains: searchTerm, mode: 'insensitive' } } }
      ]
    });
  }

  if (genre && genre.length > 0) {
    andCondition.push({
      genre: {
        genreName: {
          contains: genre,
          mode: "insensitive"
        }
      }
    });
  }

  if (platform && platform.length > 0) {
    andCondition.push({
      platform: {
        platformName: {
          contains: platform,
          mode: "insensitive"
        }
      }
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key]
        }
      }))
    });
  }

  let orderBy: Prisma.ContentOrderByWithRelationInput = { createdAt: 'desc' }; // default

  if (options.sortBy) {
    switch (options.sortBy) {
      case 'rating':
        orderBy = { price: 'desc' };
        break;

      case 'reviews':
        orderBy = { createdAt: 'desc' };
        break;

      case 'latest':
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

        orderBy = { createdAt: 'desc' };
        break;
    }
  }

  const whereConditions: Prisma.ContentWhereInput = andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.content.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy,
    include: {
      genre: true,
      platform: true,
    },
  });

  const total = await prisma.content.count({
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
};



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

export const ContentServices = {
  createContentIntoDB,
  getSingleContentFromDB,
  deleteSingleContentFromDB,
  getAllFromDB,
};
