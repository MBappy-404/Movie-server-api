import httpStatus from "http-status";
import { catchAsync } from "../../helper/catchAsync";
import { UserServices } from "./user.service";
import pick from "../../utils/pick";
import { userFilterableFields } from "./user.constant";
import sendResponse from "../../helper/sendResponse";
import { IAuth } from "./user.interface";

 
const RegisterUser = catchAsync(async(req, res)=> {
    const result = await UserServices.UserRegisterIntoDB(req.body)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User Register Successfully",
        data: result
    })
})
 

const getAllUserData = catchAsync(async(req, res)=> {
    const filters = pick(req.query, userFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])

    const result = await UserServices.getAllFromDB(filters, options)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users data fetched!",
        meta: result.meta,
        data: result.data
    })
})

const getUserById = catchAsync(async(req, res)=> {
    const {id} = req.params
    const result = await UserServices.getUserByIdIntoDB(id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User data fetched!",
        data: result
    })
})

const DeleteUser = catchAsync(async(req, res)=> {
    const {id} = req.params
    const result = await UserServices.deleteUserIntoDB(id)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Delete user Successfully!"
    })
})

const UpdateUser = catchAsync(async(req, res)=> {
    const {id} = req.params
    const result = await UserServices.updateUserIntoDB(id, req.body);
    sendResponse(res, {
        success: true,
        message: "User update successfully",
        statusCode: httpStatus.OK,
        data: result
    })
})


export const UserController = {
 
    RegisterUser,
    getAllUserData,
    getUserById,
    DeleteUser,
    UpdateUser
 

}
 
