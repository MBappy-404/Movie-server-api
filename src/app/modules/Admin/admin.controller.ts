import { catchAsync } from "../../helper/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../helper/sendResponse";
import { AdminService } from "./admin.service";

const AdminBlockUser = catchAsync(async (req, res) => {
  await AdminService.UserBlockIntoDB(req.user);
  sendResponse(res, {
    success: true,
    message: "User blocked successfully",
    statusCode: httpStatus.OK,
  });
});
const getAdminDashboardStats = catchAsync(async (req, res) => {
  const result = await AdminService.getAdminDashboardStats();
  sendResponse(res, {
    success: true,
    message: "Dashboard stats fetched successfully",
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const AdminController = {
  AdminBlockUser,
  getAdminDashboardStats
};
