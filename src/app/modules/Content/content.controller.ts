import { catchAsync } from "../../helper/catchAsync";
import sendResponse from "../../helper/sendResponse";
import httpstatus from "http-status";
import { ContentServices } from "./content.service";
import pick from "../../utils/pick";
import { contentFilterableFields } from "./content.constant";
import { UserServices } from "../User/user.service";

const createContent = catchAsync(async (req, res) => {
  const result = await ContentServices.createContentIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpstatus.CREATED,
    success: true,
    message: "Content is created Successfully!",
    data: result,
  });
});

const getSingleContent = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ContentServices.getSingleContentFromDB(id);

  sendResponse(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: "Single Content is retrieved Successfully!",
    data: result,
  });
});

const deleteSingleContent = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await ContentServices.deleteSingleContentFromDB(id);

  sendResponse(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: "Content is deleted Successfully!",
    data: result,
  });
});

const getAllContentData = catchAsync(async(req, res)=> {
  const filters = pick(req.query, contentFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])

  const result = await ContentServices.getAllFromDB(filters, options)
  sendResponse(res, {
      statusCode: httpstatus.OK,
      success: true,
      message: "Contents data fetched!",
      meta: result.meta,
      data: result.data
  })
})

export const ContentController = {
  createContent,
  getSingleContent,
  deleteSingleContent,
  getAllContentData,
};
