import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const BookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
    },
    rent: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["reserved", "cancelled", "booked"],
      default: "reserved",
    },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

BookingSchema.plugin(mongooseAggregatePaginate);
export const Booking = mongoose.model("Booking", BookingSchema);
