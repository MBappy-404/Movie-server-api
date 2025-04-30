import prisma from "../../helper/prisma";

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

export const ContentServices = {
  createContentIntoDB,
  getSingleContentFromDB,
  deleteSingleContentFromDB,
};
