import AppError from "../../errors/AppError";
import prisma from "../../helper/prisma";
import httpStatus from "http-status";

const createGenreIntoDB = async (payload: { genreName: string }) => {
  const result = await prisma.genre.create({
    data: payload,
  });

  return result;
};

const getAllGenreFromDB = async () => {
  const result = await prisma.genre.findMany();

  return result;
};

const updateUpdateFromDB = async(id: string, payload: any)=> {
 const genreverify = await prisma.genre.findFirst({
    where: {
      id,
    },
  });

  if(!genreverify){
    throw new AppError(httpStatus.BAD_REQUEST, "Genre Not Found")
  }

  const result = await prisma.genre.update({
    where: {id},
    data: payload
  })

  return result

}

const deleteGenreFromDB = async (id: string) => {
  await prisma.genre.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    const contentsInfo = await tx.content.deleteMany({
      where: {
        genreId: id,
      },
    });

    await tx.genre.delete({
      where: {
        id,
      },
    });
  });

  return result;
};

export const GenreServices = {
  createGenreIntoDB,
  getAllGenreFromDB,
  deleteGenreFromDB,
  updateUpdateFromDB
};
