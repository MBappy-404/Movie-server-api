import prisma from "../../helper/prisma"
import { IUser } from "./user.interface"

const UserRegisterIntoDB = async(payload: IUser)=> {


    const result = prisma.user.create({
        data: payload
    })
    return result
}

export const UserServices = {
    UserRegisterIntoDB
}