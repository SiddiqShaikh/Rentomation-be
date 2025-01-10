import express from "express";
import {
  createBooking,
  getBookingById,
  updateBooking,
  getBookingsByPropertyId,
} from "../controllers/booking.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Route for creating a booking
router.post("/bookings", verifyJWT, createBooking);

// Route for fetching a booking by ID
router.get("/bookings/:id", verifyJWT, getBookingById);
router.get(
  "/bookings/property/:propertyId",
  verifyJWT,
  getBookingsByPropertyId
);

// Route for updating a booking
router.put("/bookings/:id", verifyJWT, updateBooking);

export default router;
