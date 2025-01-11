import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createComplaint,
  deleteComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
} from "../controllers/complaint.controller.js";

const router = Router();

router
  .route("/")
  .post(createComplaint) // Create a new complaint
  .get(getAllComplaints); // Get all complaints

router
  .route("/:id")
  .get(getComplaintById) // Get a specific complaint by ID
  .put(updateComplaint) // Update a specific complaint by ID
  .delete(deleteComplaint); // Delete a specific complaint by ID

export default router;
