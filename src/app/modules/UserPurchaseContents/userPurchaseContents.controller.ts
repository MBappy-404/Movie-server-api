import { catchAsync } from "../../helper/catchAsync";
import sendResponse from "../../helper/sendResponse";
import { UserPurchaseContentsService } from "./userPurchaseContents.service";
import httpStatus from "http-status";

const getAllUserPurchaseContents = catchAsync(async (req, res) => {
  const result =
    await UserPurchaseContentsService.getAllUserPurchaseContentsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User purchase contents retrieved successfully",
    data: result,
  });
});

const getMyPurchaseContents = catchAsync(async (req, res) => {
  const result = await UserPurchaseContentsService.getMyPurchaseContentsFromDB(
    req.user.id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My purchase contents retrieved successfully",
    data: result,
  });
});

export const UserPurchaseContentsController = {
  getAllUserPurchaseContents,
  getMyPurchaseContents,
};
