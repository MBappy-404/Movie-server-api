import status from "http-status"
import AppError from "../errors/AppError"
import { catchAsync } from "../helper/catchAsync"
import verifyToken from "../utils/verifyToken"
import config from "../config"
import { JwtPayload, Secret } from "jsonwebtoken"
import { UserRole } from "@prisma/client"
import prisma from "../helper/prisma"



const auth = (...roles: string[]) => {
    return catchAsync(async (req, res, next) => {
        let token = null
        // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        //   token = req.headers.authorization.split(" ")[1];
        // }

        // // without Bearer 
        token = req.headers.authorization

        // checking if the token is missing
        if (!token) {
            throw new AppError(status.UNAUTHORIZED, "You are not Authorized")
        }
        
        // checking if the given token is valid
        const decoded = await verifyToken(token, config.jwt.jwt_access_secret as Secret)

        const role = (decoded as JwtPayload).role

        if (roles && !roles.includes(role as UserRole)) {
            throw new AppError(status.UNAUTHORIZED, "You are not Authorized")
        }
        req.user = decoded
        next()
    })
}

export default auth