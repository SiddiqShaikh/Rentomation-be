import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const propertySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    city: { type: String, required: true },
    address: { type: String, required: true },
    images: { type: [String], required: false },
    room: { type: Number, required: false },
    propertyType: { type: String, required: false },
    parking: { type: Boolean, default: false },
    rent: { type: String, required: true },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

propertySchema.plugin(mongooseAggregatePaginate);
export const Property = mongoose.model("Property", propertySchema);
