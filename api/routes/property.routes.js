import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createProperty,
  deleteProperty,
  getAllProperties,
  getMyProperties,
  getPropertyDetails,
  updateProperty,
} from "../controllers/property.controller.js";

const router = Router();

router.route("/get-all").get(getAllProperties);
router.route("/:propertyId").get(getPropertyDetails);
router.route("/my-properties").get(verifyJWT, getMyProperties);

router.route("/create").post(verifyJWT, createProperty);

router.route("/:propertyId").put(verifyJWT, updateProperty);

router.route("/:propertyId").delete(verifyJWT, deleteProperty);


export default router;
