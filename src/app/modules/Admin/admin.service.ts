import { UserStatus } from "@prisma/client";
import AppError from "../../errors/AppError";
import prisma from "../../helper/prisma"
import httpStatus from "http-status";


const UserBlockIntoDB = async (id: string) => {
    const userData = await prisma.user.findFirst({
        where: {id}
    })
    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (userData.status === UserStatus.BLOCKED ) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already blocked")
    }

    const result = await prisma.user.update({
        where: {id: userData.id},
        data: {
            status: UserStatus.BLOCKED
        } 
    })

    return result
}

export const AdminService = {
    UserBlockIntoDB
}