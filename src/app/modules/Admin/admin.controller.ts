import { catchAsync } from "../../helper/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../helper/sendResponse";
import { AdminService } from "./admin.service";


const AdminBlockUser = catchAsync(async(req, res)=> {
    const {id}: any = req.params.userId;
    await AdminService.UserBlockIntoDB(id)
    sendResponse(res, {
        success: true,
        message: 'User blocked successfully',
        statusCode: httpStatus.OK,

    })
}
)

export const AdminController = {
    AdminBlockUser
}