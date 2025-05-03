import { catchAsync } from "../../helper/catchAsync";
import sendResponse from "../../helper/sendResponse";
import { ContentLinksService } from "./contentLinks.service";
import httpStatus from "http-status";

const createContentLinksIntoDB = catchAsync(async (req, res) => {
  const result = await ContentLinksService.createContentLinksIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "ContentLinks created successfully",
    data: result,
  });
});

const getAllContentLinksFromDB = catchAsync(async (req, res) => {
  const result = await ContentLinksService.getAllContentLinksFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ContentLinks retrieved successfully",
    data: result,
  });
});

const getSingleContentLinksFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ContentLinksService.getSingleContentLinksFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ContentLinks retrieved successfully",
    data: result,
  });
});

const updateContentLinksIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ContentLinksService.updateContentLinksIntoDB(
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ContentLinks updated successfully",
    data: result,
  });
});

const deleteContentLinksFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ContentLinksService.deleteContentLinksFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ContentLinks deleted successfully",
    data: result,
  });
});

export const ContentLinksController = {
  createContentLinksIntoDB,
  getAllContentLinksFromDB,
  getSingleContentLinksFromDB,
  updateContentLinksIntoDB,
  deleteContentLinksFromDB,
};
