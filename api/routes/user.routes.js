import { Router } from "express";
import {
  getProfile,
  login,
  register,
  uploadOnCloudinaryImage,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/profile").get(verifyJWT, getProfile);

router
  .route("/upload-picture")
  .post(upload.single("profile"), uploadOnCloudinaryImage);

router.route("/get-users").get(getAllUser);

export default router;
