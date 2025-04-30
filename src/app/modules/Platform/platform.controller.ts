import { catchAsync } from "../../helper/catchAsync";
import sendResponse from "../../helper/sendResponse";
import { platformService } from "./platform.service";
import httpStatus from "http-status";

const createPlaform = catchAsync(async (req, res) => {
  const result = await platformService.createPlatfromIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Platform created successfully",
    data: result,
  });
});

const getAllPlatforms = catchAsync(async (req, res) => {
  const result = await platformService.getAllPlatformsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Platforms retrieved successfully",
    data: result,
  });
});

const getSinglePlatform = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await platformService.getSinglePlatformFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Platform retrieved successfully",
    data: result,
  });
});

const updatePlatform = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await platformService.updatePlatformIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Platform updated successfully",
    data: result,
  });
});

const deletePlatform = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await platformService.deletePlatformFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Platform deleted successfully",
    data: result,
  });
});

export const platformController = {
  createPlaform,
  getAllPlatforms,
  getSinglePlatform,
  updatePlatform,
  deletePlatform,
};
