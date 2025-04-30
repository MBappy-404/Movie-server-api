import { UserStatus } from "@prisma/client";
import AppError from "../../errors/AppError";
import prisma from "../../helper/prisma"
import httpStatus from "http-status";


const UserBlockIntoDB = async (id: string) => {
   await prisma.user.findFirstOrThrow({
        where: {id}
    })
    
    const result = await prisma.$transaction(async(transactionClient)=> {

        const verifydata = await transactionClient.user.findFirst({
            where: {id}
        })
        if(verifydata?.status === "BLOCKED") {
            throw new AppError(httpStatus.BAD_REQUEST, "User already blocked")
        }

        await transactionClient.user.update({
            where: {id},
            data: {
                status: UserStatus.BLOCKED
            }
        })
        
    })

    return result
}

export const AdminService = {
    UserBlockIntoDB
}