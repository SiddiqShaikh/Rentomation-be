import { Complaint } from "../models/complain.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new complaint
const createComplaint = asyncHandler(async (req, res) => {
  const { name, complaintText } = req.body;

  if (!complaintText) {
    return res.status(400).json({
      success: false,
      message: "Complaint text is required",
    });
  }

  const complaint = await Complaint.create({
    complaintText,
    name,
  });

  res.status(201).json({
    success: true,
    message: "Complaint created successfully",
    data: complaint,
  });
});

// Get all complaints
const getAllComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find()
    // .populate("user", "email") // Populates the `user` field with the email
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Complaints fetched successfully",
    data: complaints,
  });
});

// Get a single complaint by ID
const getComplaintById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const complaint = await Complaint.findById(id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Complaint fetched successfully",
    data: complaint,
  });
});

// Update a complaint by ID
const updateComplaint = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { complaintText } = req.body;

  const complaint = await Complaint.findByIdAndUpdate(
    id,
    { complaintText },
    { new: true, runValidators: true }
  );

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Complaint updated successfully",
    data: complaint,
  });
});

// Delete a complaint by ID
const deleteComplaint = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const complaint = await Complaint.findByIdAndDelete(id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Complaint deleted successfully",
  });
});

export {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
};
