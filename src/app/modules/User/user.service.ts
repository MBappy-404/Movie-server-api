import { Prisma, UserStatus } from "@prisma/client"
import httpStatus from 'http-status';
import { paginationHelper } from "../../helper/paginationHelper"
import prisma from "../../helper/prisma"
import { IPaginationOptions } from "../../interface/pagination.type"
import { userSearchAbleFields } from "./user.constant"
import { IUser } from "./user.interface"
import * as bcrypt from 'bcrypt'
import AppError from "../../errors/AppError"
const UserRegisterIntoDB = async(payload: IUser)=> {
    
    const hashedPassword: string = await bcrypt.hash(payload.password, 12) //  hash password
    payload.password = hashedPassword 

    const result = prisma.user.create({
        data: payload
    })
    return result
}

const getAllFromDB = async (params: any, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options)
    const { searchTerm, ...filterData } = params

    const andCondition: Prisma.UserWhereInput[] = [];

    if (params.searchTerm) {
        andCondition.push({
            OR: userSearchAbleFields.map(filed => ({
                [filed]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }
    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const whereConditons: Prisma.UserWhereInput = andCondition.length > 0 ? { AND: andCondition } : {}

    const result = await prisma.user.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }

    })
    const total = await prisma.user.count({
        where: whereConditons,
    })

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }

}

const getUserByIdIntoDB = async(id: string)=> {
    const verify = await prisma.user.findUnique({
        where: {id}
    })
    if(!verify){
       throw new AppError(
            httpStatus.BAD_REQUEST,
            'User Not found!',
          );
    }
    const result = await prisma.user.findUnique({
        where: {id}
    })
    return result
}

const deleteUserIntoDB = async(id: string)=> {
    await prisma.user.findUniqueOrThrow({
        where: {id}
    })

    const result = await prisma.user.delete({
        where: {id}
    })
    return result
}

const updateUserIntoDB = async(id: string, payload: IUser)=> {
    const verifyUser = await prisma.user.findUniqueOrThrow({
        where: {id, status: UserStatus.ACTIVE}
    })
    const update = await prisma.user.update({
        where: {email: verifyUser.email},
        data: payload
    })
    return update

}

export const UserServices = {
    UserRegisterIntoDB,
    getAllFromDB,
    getUserByIdIntoDB,
    deleteUserIntoDB,
    updateUserIntoDB
}