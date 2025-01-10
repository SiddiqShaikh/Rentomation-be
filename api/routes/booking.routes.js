import express from 'express';
import { createBooking, getBookingById, updateBooking ,getBookingsByPropertyId} from '../controllers/booking.controller.js';

const router = express.Router();

// Route for creating a booking
router.post('/bookings', createBooking);

// Route for fetching a booking by ID
router.get('/bookings/:id', getBookingById);
router.get('/bookings/property/:propertyId', getBookingsByPropertyId);

// Route for updating a booking
router.put('/bookings/:id', updateBooking);

export default router;