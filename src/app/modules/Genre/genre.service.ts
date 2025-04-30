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

  await prisma.genre.delete({
    where: {
      id,
    },
  });
};

export const GenreServices = {
  createGenreIntoDB,
  getAllGenreFromDB,
  deleteGenreFromDB,
};
