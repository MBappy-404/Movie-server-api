import { catchAsync } from "../../helper/catchAsync";
import sendResponse from "../../helper/sendResponse";
import httpStatus from "http-status";
import { CommentServices } from "./comment.service";

const addComment = catchAsync(async (req, res) => {
  const result = await CommentServices.addComment(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Comment added successfully",
    data: result,
  });
});
const getAllComments = catchAsync(async (req, res) => {
  const result = await CommentServices.getAllComments();
  sendResponse(res, {
    statusCode: httpStatus.FOUND,
    success: true,
    message: "Comments fetched successfully",
    data: result,
  });
});

const updateComment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CommentServices.updateComment(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.FOUND,
    success: true,
    message: " Comment updated successfully",
    data: result,
  });
});
const deleteComment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CommentServices.deleteComment(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment deleted successfully",
    // data: result
  });
});

const getSingleComment = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CommentServices.getSingleComment(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comments are retrieved successfully",
    data: result,
  });
});

export const CommentController = {
  addComment,
  getAllComments,
  updateComment,
  deleteComment,
  getSingleComment,
};
