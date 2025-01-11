import mongoose, { Schema } from "mongoose";

// Message Schema
const messageSchema = new Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referring to the User model
      required: true,
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referring to the User model
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Add pagination plugin (optional, if needed)
messageSchema.plugin(mongooseAggregatePaginate);

// Export Message Model
export const Message = mongoose.model("Message", messageSchema);
