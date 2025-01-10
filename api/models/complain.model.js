import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    complaintText: {
      type: String,
      required: [true, "Complaint text is required"],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Complaint = mongoose.model("Complaint", complaintSchema);
