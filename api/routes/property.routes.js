import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createProperty,
  deleteProperty,
  getAllProperties,
  getDashboardAnalytics,
  getMyProperties,
  getPropertyDetails,
  updateProperty,
} from "../controllers/property.controller.js";

const router = Router();

router.route("/get-all").get(getAllProperties);
router.route("/dashboard/all").get(getDashboardAnalytics);
router.route("/my-properties").get(verifyJWT, getMyProperties);
router.route("/:propertyId").get(getPropertyDetails);

router.route("/create").post(verifyJWT, createProperty);

router.route("/:propertyId").put(verifyJWT, updateProperty);

router.route("/:propertyId").delete(verifyJWT, deleteProperty);

export default router;
