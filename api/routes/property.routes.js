import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createProperty } from "../controllers/property.controller.js";

const router = Router();

router.route("/create").post(verifyJWT,createProperty);


export default router;
