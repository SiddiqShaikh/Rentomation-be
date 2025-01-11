import { Booking } from "../models/booking.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Property } from "../models/property.model.js";

const createBooking = asyncHandler(async (req, res) => {
  try {
    if (Object.keys(req.body).length < 1) {
      return res.status(400).json({
        success: false,
        message: "Missing Required body",
      });
    }
    let { propertyId, startDateTime, endDateTime } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: `Invalid PropertyId`,
      });
    }
    const newBooking = new Booking({
      user: req.user._id,
      property: property._id,
      owner: property.owner,
      startDateTime,
      endDateTime,
      rent: property.rent,
    });
    await newBooking.save();
    return res.status(201).json({
      success: true,
      message: "Booking Created Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error || "Internal Server Error",
    });
  }
});

const getBookingById = asyncHandler(async (req, res) => {
  try {
    if (Object.keys(req.body).length < 1) {
      return res.status(400).json({
        success: false,
        message: "Missing required body",
      });
    }
    const { bookingId } = req.body;
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking Id required",
      });
    }
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Booking Fetched successfully",
      booking,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error || "Internal Server Error",
    });
  }
});

const updateBooking = asyncHandler(async (req, res) => {
  const { bookingId, status } = req.body;

  if (!bookingId || !status) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    const booking = await Booking.findById(bookingId).populate("property");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const property = booking.property;
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (status === "booked" && !property.owner.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only the property owner can change the status to booked",
      });
    }

    booking.status = status;
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});

const getBookingsByPropertyId = asyncHandler(async (req, res) => {
  try {
    const { propertyId } = req.params;
    if (!propertyId) {
      return res.status(400).json({
        success: false,
        message: "Property Id required",
      });
    }
    const bookings = await Booking.find({ property: propertyId });
    return res.status(200).json({
      message: "Bookings fetched successfully",
      bookings,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});

const getBookingsByOwnerId = asyncHandler(async (req, res) => {
  try {
    const { ownerId } = req.params;
    if (!ownerId) {
      return res.status(400).json({
        success: false,
        message: "Owner ID required",
      });
    }

    const bookings = await Booking.find({ owner: ownerId }).populate(
      "user",
      "-password -refreshToken -role"
    ); // Populate user and exclude sensitive fields

    return res.status(200).json({
      message: "Bookings fetched successfully",
      bookings,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});
const getBookingsByUserId = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Owner Id required",
      });
    }
    const bookings = await Booking.find({ user: userId });
    return res.status(200).json({
      message: "Bookings fetched successfully",
      bookings,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});

export {
  createBooking,
  getBookingById,
  updateBooking,
  getBookingsByPropertyId,
  getBookingsByOwnerId,
  getBookingsByUserId,
};
