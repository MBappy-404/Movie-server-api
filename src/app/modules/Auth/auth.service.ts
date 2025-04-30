import { UserStatus } from "@prisma/client"
import prisma from "../../helper/prisma"
import * as bcrypt from 'bcrypt'
import AppError from "../../errors/AppError"
import httpStatus from "http-status"
import generateToken from "../../utils/generateToken"
import config from "../../config"
import { Secret } from "jsonwebtoken"
import verifyToken from "../../utils/verifyToken"
import { IResetPassword } from "./auth.interface"


const loginUserIntoDB = async (payload: any) => {
    const userData = await prisma.user.findFirstOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })
    
    if(userData?.status === "BLOCKED"){
        throw new AppError(httpStatus.BAD_REQUEST, "User already is blocked")
    }
    
    const incorrectPassword = await bcrypt.compare(payload.password, userData?.password as string)
    if (!incorrectPassword) {
        throw new AppError(httpStatus.BAD_REQUEST, "Password is incorrect")
    }

    const jwtPayloadData = {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        status: userData.status
    }

    const accessToken = generateToken(jwtPayloadData, config.jwt.jwt_access_secret as Secret, config.jwt.jwt_access_expires_in as string)
    const refreshToken = generateToken(jwtPayloadData, config.jwt.jwt_refresh_secret as Secret, config.jwt.jwt_refresh_expires_in as string)

    return {
        accessToken,
        refreshToken
    }

}

const refreshTokenIntoDB = async (token: string) => {
    const decoded: any = verifyToken(token, config.jwt.jwt_refresh_secret as Secret)

    const { email } = decoded

    const userData = await prisma.user.findFirstOrThrow({
        where: { email }
    })
    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }

    // checking if the user is blocked
    const userStatus = userData.status === "BLOCKED"

    if (userStatus === true) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
    }

    const jwtPayloadData = {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        status: userData.status
    }

    const accessToken = generateToken(jwtPayloadData, config.jwt.jwt_access_secret as Secret, config.jwt.jwt_access_expires_in as string)
     return {
        accessToken
     }
}

const LogoutIntoDB = async () => {
    return null;
}

const resetPasswordIntoDB = async (payload: IResetPassword) => {
    const user = await prisma.user.findFirst({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

    await prisma.user.update({
        where: {
            email: payload.email
        },
        data: {
            password: hashedPassword
        }
    });

    return null;
};



export const AuthService = {
    loginUserIntoDB,
    refreshTokenIntoDB,
    LogoutIntoDB,
    resetPasswordIntoDB
}