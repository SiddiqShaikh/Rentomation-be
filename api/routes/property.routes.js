import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createProperty,
  getAllProperties,
  getMyProperties,
} from "../controllers/property.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, createProperty);
router.route("/get-all").get(getAllProperties);
router.route("/my-properties").get(verifyJWT, getMyProperties);

export default router;
