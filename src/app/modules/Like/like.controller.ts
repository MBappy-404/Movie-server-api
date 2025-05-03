import { catchAsync } from "../../helper/catchAsync";
import sendResponse from "../../helper/sendResponse";
import httpStatus from "http-status";
import { LikeServices } from "./like.service";
 

const addLike = catchAsync(async (req, res) => {
  const result = await LikeServices.addLike(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Like added successfully",
    data: result,
  });
});
 

const updateLike = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await LikeServices.updateLike(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.FOUND,
    success: true,
    message: " Like updated successfully",
    data: result,
  });
});
 
export const LikeController = {
   addLike,
   updateLike,
  
};
