import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const locationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);
const propertySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    city: { type: String, required: true },
    location: { type: locationSchema, required: true },
    images: { type: [String], required: false },
    bed: { type: Number, required: false, default: 1 },
    shower: { type: Number, required: false, default: 1 },
    payper: { type: String, required: false },
    parking: { type: Boolean, default: false },
    rent: { type: String, required: true },
    status: {
      type: String,
      required: false,
      enum: ["verified", "unverified"],
      default: "verified",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

propertySchema.plugin(mongooseAggregatePaginate);
export const Property = mongoose.model("Property", propertySchema);
