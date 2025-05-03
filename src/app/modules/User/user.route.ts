import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { UserValidation } from "./user.validation";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";
import { FileUploader } from "../../helper/fileUploader";

const router = express.Router();

router.post(
  "/register",
  FileUploader.upload.single('file'), (req: Request, res: Response, next: NextFunction)=> {
    req.body = UserValidation.createUserValidation.parse(JSON.parse(req.body.data))
    return UserController.RegisterUser(req, res, next)
  }
);
router.get("/", auth(UserRole.ADMIN), UserController.getAllUserData);
router.get("/:id", UserController.getUserById);
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.USER),
  FileUploader.upload.single('file'), (req: Request, res: Response, next: NextFunction)=> {
    req.body = UserValidation.updateUserValidation.parse(JSON.parse(req.body.data))
    return UserController.UpdateUser(req, res, next)
  }
);
router.delete("/:id", auth(UserRole.ADMIN), UserController.DeleteUser);

export const UserRoutes = router;
