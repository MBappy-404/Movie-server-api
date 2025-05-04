import { catchAsync } from "../../helper/catchAsync";
import sendResponse from "../../helper/sendResponse";
import { GenreServices } from "./genre.service";
import httpstatus from "http-status";

const createGenre = catchAsync(async (req, res) => {
  const result = await GenreServices.createGenreIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpstatus.CREATED,
    success: true,
    message: "Genre created Successfully!",
    data: result,
  });
});

const getAllGenre = catchAsync(async (req, res) => {
  const result = await GenreServices.getAllGenreFromDB();

  sendResponse(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: "All genres are retrieved Successfully!",
    data: result,
  });
});

const updateGenre = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await GenreServices.updateUpdateFromDB(id, req.body);

  sendResponse(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: "Genre is updated Successfully!",
    data: result,
  });
});

const deleteGenre = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await GenreServices.deleteGenreFromDB(id);

  sendResponse(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: "This genre is deleted Successfully!",
    data: result,
  });
});

export const GenreController = {
  createGenre,
  getAllGenre,
  deleteGenre,
  updateGenre
};
