import httpStatus from 'http-status'
import { catchAsync } from '../../helper/catchAsync'
import { AuthService } from './auth.service'
import sendResponse from '../../helper/sendResponse'

const LoginUser = catchAsync(async(req, res)=> {
    const result = await AuthService.loginUserIntoDB(req.body)
    const {accessToken, refreshToken} = result

    res.cookie("refreshToken", refreshToken, {
        secure: false,
        httpOnly: true
    })
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Logged in Successful",
        data: {
            accessToken: accessToken
        }
    })
})

export const AuthController = {
    LoginUser
}