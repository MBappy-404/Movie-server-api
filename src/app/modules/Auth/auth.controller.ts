import httpStatus from 'http-status'
import { catchAsync } from '../../helper/catchAsync'
import { AuthService } from './auth.service'
import sendResponse from '../../helper/sendResponse'
import config from '../../config'

const LoginUser = catchAsync(async(req, res)=> {
    const result = await AuthService.loginUserIntoDB(req.body)
    const {accessToken, refreshToken} = result

    res.cookie("refreshToken", refreshToken, {
        secure: config.node_env === "production",
        httpOnly: true
    })
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Logged in Successful",
        data: {
            accessToken,
            refreshToken
        }
    })
})

const refreshToken = catchAsync(async(req, res)=> {
    const { refreshToken } = req.cookies;
    const result = await AuthService.refreshTokenIntoDB(refreshToken)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Access token is retrieved succesfully!',
        data: result,
      });
})

const logout = catchAsync(async(req, res)=> {
    await AuthService.LogoutIntoDB()

    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
        secure: false,
        httpOnly: true
    })

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Logged out successfully",
        data: null
    })
})

const resetPassword = catchAsync(async(req, res)=> {
    const result = await AuthService.resetPasswordIntoDB(req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password reset successfully!",
        data: result
    })
})




export const AuthController = {
    LoginUser,
    refreshToken,
    logout,
    resetPassword
}