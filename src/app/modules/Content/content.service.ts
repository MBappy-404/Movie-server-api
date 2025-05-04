import { Prisma } from "@prisma/client";
import prisma from "../../helper/prisma";
import { IPaginationOptions } from "../../interface/pagination.type";
import { paginationHelper } from "../../helper/paginationHelper";
import { FileUploader } from "../../helper/fileUploader";
import { IFile } from "../../interface/file.type";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createContentIntoDB = async (req: any) => {


  const file = req.file
  const datainfo = req.body


  if (file) {
    const uploadData = await FileUploader.uploadToCloudinary(file)
    req.body.content.thumbnail = uploadData?.secure_url
  }



  const result = await prisma.$transaction(async (tx) => {
    const data = datainfo.content;

    const content = await tx.content.create({
      data: { ...data },
    });

    await tx.contentLinks.create({
      data: {
        contentId: content.id,
        contentLink: datainfo.contentLink,
      },
    });

    return content;
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
    include: {
      genre: true,
      platform: true,
      reviews: {
        include: {
          user: true,
          _count: {
            select: { like: true },
          }
        },
      },
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Content not found");
  }

  // Calculate average rating for the specific content
  const contentWithAvgRating = {
    ...result,
    averageRating:
      result.reviews.length > 0
        ? result.reviews.reduce(
            (acc, review) => acc + review.rating,
            0
          ) / result.reviews.length
        : 0,
    totalReviews: result.reviews.length
  };

  return contentWithAvgRating;
};

const deleteSingleContentFromDB = async (id: string) => {
  await prisma.content.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async(tx)=> {
    const linkinfo = await tx.contentLinks.delete({
      where: {
        contentId: id
      }
    })
    await tx.content.delete({
      where: {id: linkinfo.contentId}
    })
    
  })
  return result
};

const getAllFromDB = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, genre, platform, ...filterData } = params;

  const andCondition: Prisma.ContentWhereInput[] = [];

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
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.ContentWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  let orderBy: Prisma.ContentOrderByWithRelationInput = { createdAt: "desc" }; // default

  if (options.sortBy) {
    const sortOrder =
      options.sortOrder?.toLowerCase() === "asc" ? "asc" : "desc";

    switch (options.sortBy) {
      case "rating":
        // Sort by average rating from reviews
        const contents = await prisma.content.findMany({
          where: whereConditions,
          include: {
            genre: true,
            platform: true,
            ContentLinks: true,
            reviews: {
              select: {
                rating: true,
              },
            },
          },
        });

        const contentsWithAvgRating = contents.map((content) => ({
          ...content,
          averageRating:
            content.reviews.length > 0
              ? content.reviews.reduce(
                  (acc, review) => acc + review.rating,
                  0
                ) / content.reviews.length
              : 0,
        }));

        contentsWithAvgRating.sort((a, b) =>
          sortOrder === "asc"
            ? a.averageRating - b.averageRating
            : b.averageRating - a.averageRating
        );

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
        const contentsWithReviewCount = await prisma.content.findMany({
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

        const total = await prisma.content.count({
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

  const result = await prisma.content.findMany({
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

  const total = await prisma.content.count({
    where: whereConditions,
  });

  // Calculate average rating for all content
  const contentsWithAvgRating = result.map((content) => ({
    ...content,
    averageRating:
      content.reviews.length > 0
        ? content.reviews.reduce(
            (acc, review) => acc + review.rating,
            0
          ) / content.reviews.length
        : 0,
  }));

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: contentsWithAvgRating,
  };
};

const updateContentIntoDB = async (req: any) => {
  const { id } = req.params;
  const file = req.file as IFile;

  if (file) {
    const uploadData = await FileUploader.uploadToCloudinary(file);
    req.body.content.thumbnail = uploadData?.secure_url;
  }

  const verifycontent = await prisma.content.findUnique({
    where: { id }
  });
  
  if (!verifycontent) {
    throw new AppError(httpStatus.BAD_REQUEST, "Content is not found!!");
  }

  const result = await prisma.$transaction(async (tx) => {
    // Update content
    const updatedContent = await tx.content.update({
      where: { id },
      data: req.body.content
    });

    // Update content link if provided
    if (req.body.contentLink) {
      const contentLink = await tx.contentLinks.findFirst({
        where: { contentId: id }
      });

      if (contentLink) {
        await tx.contentLinks.update({
          where: { id: contentLink.id },
          data: { contentLink: req.body.contentLink }
        });
      } else {
        await tx.contentLinks.create({
          data: {
            contentId: id,
            contentLink: req.body.contentLink
          }
        });
      }
    }

    return updatedContent;
  });

  return result;
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
  updateContentIntoDB
};
