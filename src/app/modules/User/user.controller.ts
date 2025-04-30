import httpstatus from "http-status";
import { catchAsync } from "../../helper/catchAsync";
import { sendResponse } from "../../helper/sendResponse";
import { UserServices } from "./user.service";

const RegisterUser = catchAsync(async(req, res)=> {
    const result = await UserServices.UserRegisterIntoDB(req.body)
    sendResponse(res, {
        statusCode: httpstatus.CREATED,
        success: true,
        message: "User Register Successfully"
    })
})

export const UserController = {
    RegisterUser
}