import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    complaintText: {
      type: String,
      required: [true, "Complaint text is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Complaint = mongoose.model("Complaint", complaintSchema);
