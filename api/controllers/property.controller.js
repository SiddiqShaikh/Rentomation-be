import { Property } from "../models/property.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { propertyCreationValidation } from "../utils/schemaValidations/propertyValidation.js";

const createProperty = asyncHandler(async (req, res) => {
  try {
    if (Object.keys(req.body).length < 1) {
      return res.status(400).json({
        success: false,
        message: "Missing Required Fields",
      });
    }
    //validation
    const reqBody = Object.keys(req.body);
    const validBody = [
      "name",
      "city",
      "address",
      "room",
      "images",
      "propertyType",
      "parking",
      "rent",
    ];

    const isValidBody = reqBody.every((body) => validBody.includes(body));
    if (!isValidBody) {
      return res.status(400).json({
        success: false,
        message: "Invalid Body params",
      });
    }
    const { error } = propertyCreationValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Missing required field(s)",
        error: `${error.details[0].path} error`,
      });
    }
    let { name, city, address, room, images, propertyType, parking, rent } =
      req.body;

    const createProperty = new Property({
      name,
      city,
      address,
      room,
      images,
      propertyType,
      parking,
      rent,
      owner: req.user._id,
    });
    if (!createProperty) {
      return res.status(400).json({
        success: false,
        message: "Failed to create property",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: createProperty,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Network Error",
    });
  }
});
export { createProperty };
