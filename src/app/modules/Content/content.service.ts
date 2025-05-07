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
  // Check if content exists
  await prisma.content.findUniqueOrThrow({
    where: { id },
  });

  // Fetch full content data including relations
  const result = await prisma.content.findUnique({
    where: { id },
    include: {
      genre: true,
      platform: true,
      reviews: {
        include: {
          user: true,
          _count: {
            select: { like: true },
          },
        },
      },
      discount: true
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Content not found");
  }

  // Count CLASSIC and UNDERRATED tags
  const classicCount = result.reviews.filter((r) => r.tags === "CLASSIC").length;
  const underratedCount = result.reviews.filter((r) => r.tags === "UNDERRATED").length;

  const dominantTag = classicCount >= underratedCount ? "CLASSIC" : "UNDERRATED";

  // Update spoilerWarning  
  const updatedContent = await prisma.content.update({
    where: { id },
    data: {
      spoilerWarning: dominantTag,
    },
  });

  // Calculate average rating
  const averageRating =
    result.reviews.length > 0
      ? parseFloat(
          (
            result.reviews.reduce((acc, r) => acc + r.rating, 0) / result.reviews.length
          ).toFixed(1)
        )
      : 0;

  const totalReviews = result.reviews.length;

  // Final return object
  return {
    ...result,                        
    spoilerWarning: updatedContent.spoilerWarning, // updated field
    averageRating,
    totalReviews,
                       
  };
};


const deleteSingleContentFromDB = async (id: string) => {
  await prisma.content.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async(tx)=> {
    // First delete all comments associated with reviews of this content
    await tx.comment.deleteMany({
      where: {
        review: {
          contentId: id
        }
      }
    });

    // Then delete all reviews associated with this content
    await tx.reviews.deleteMany({
      where: {
        contentId: id
      }
    });

    // Delete all payments associated with this content
    await tx.payment.deleteMany({
      where: {
        contentId: id
      }
    });

    // Delete all user purchase contents associated with this content
    await tx.userPurchaseContents.deleteMany({
      where: {
        contentId: id
      }
    });

    // Delete all discounts associated with this content
    await tx.discount.deleteMany({
      where: {
        contentId: id
      }
    });

    // Then delete the content link
    const linkinfo = await tx.contentLinks.delete({
      where: {
        contentId: id
      }
    });

    // Finally delete the content
    await tx.content.delete({
      where: {id: linkinfo.contentId}
    });
  });
  return result;
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
                rating: true
              }
            }
          }
        });

        const contentsWithAvgRating = contents.map((content) => {
          const reviews = content.reviews as { rating: number }[];
          const average =
            reviews.length > 0
              ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
              : 0;
        
          return {
            ...content,
            averageRating: parseFloat(average.toFixed(1)), //  
          };
        });
        

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
            genre: true,
            platform: true,
            ContentLinks: true,
            reviews: {
              select: {
                rating: true
              }
            }
          },
          orderBy: {
            reviews: {
              _count: sortOrder
            }
          },
          skip,
          take: limit,
        });

        const total = await prisma.content.count({
          where: whereConditions,
        });

        // Calculate average rating for each content
        const contentsWithReviewCountAndRating = contentsWithReviewCount.map((content) => {
          const reviews = content.reviews as { rating: number }[];
        
          const averageRating =
            reviews.length > 0
              ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
              : 0;
        
          return {
            ...content,
            averageRating: Number(averageRating.toFixed(1)),  
            totalReviews: reviews.length,                    
          };
        });
        

        return {
          meta: {
            page,
            limit,
            total,
          },
          data: contentsWithReviewCountAndRating,
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

  // Default query for all other cases
  const result = await prisma.content.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy,
    include: {
      genre: true,
      
      platform: true,
      ContentLinks: true,
      reviews: {
        select: {
          rating: true
        }
      },
      discount: true
    },
  });

  const total = await prisma.content.count({
    where: whereConditions,
  });

  // Calculate average rating for all content
  const contentsWithAvgRating = result.map((content) => {
    const reviews = content.reviews as { rating: number }[];
    return {
      ...content,
      averageRating:
        reviews.length > 0
          ? reviews.reduce(
              (acc: number, review: { rating: number }) => acc + review.rating,
              0
            ) / reviews.length
          : 0,
      totalReviews: reviews.length
    };
  });

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
export const ContentServices = {
  createContentIntoDB,
  getSingleContentFromDB,
  deleteSingleContentFromDB,
  getAllFromDB,
  updateContentIntoDB
};