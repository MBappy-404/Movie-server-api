import { catchAsync } from "../../helper/catchAsync";
import sendResponse from "../../helper/sendResponse";
import { ReviewsService } from "./reviews.service";
import  httpStatus from "http-status";

const addReviews = catchAsync(async (req, res) => {
    const result = await ReviewsService.addReviews(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Reviews added successfully",
        data: result
    })
})
const getAllReviews = catchAsync(async (req, res) => {
    const result = await ReviewsService.getAllReviews();
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Reviews fetched successfully",
        data: result
    })
})
const getSingleReviews = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ReviewsService.getSingleReviews(id);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Review fetched successfully",
        data: result
    })
})

export const ReviewsController = {
    addReviews,
    getAllReviews,
    getSingleReviews
}