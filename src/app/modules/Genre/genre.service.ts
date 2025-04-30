import prisma from "../../helper/prisma";

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
};
