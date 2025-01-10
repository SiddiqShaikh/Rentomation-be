import mongoose from "mongoose";
import { Property } from "../models/property.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

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
      "title",
      "city",
      "location",
      "bed",
      "images",
      "payper",
      "parking",
      "rent",
      "description",
      "shower",
    ];

    const isValidBody = reqBody.every((body) => validBody.includes(body));
    if (!isValidBody) {
      return res.status(400).json({
        success: false,
        message: "Invalid Body params",
      });
    }
    // const { error } = propertyCreationValidation.validate(req.body);
    // if (error) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Missing required field(s)",
    //     error: `${error.details[0].path} error`,
    //   });
    // }
    let {
      title,
      city,
      location,
      bed,
      images,
      payper,
      parking,
      rent,
      description,
      shower,
    } = req.body;

    const createProperty = new Property({
      title,
      city,
      location,
      bed,
      images,
      payper,
      parking,
      rent,
      description,
      shower,
      owner: req.user._id,
    });
    if (!createProperty) {
      return res.status(400).json({
        success: false,
        message: "Failed to create property",
      });
    }
    createProperty.save();
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

const getAllProperties = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortType = "desc",
    sortBy = "createdAt",
  } = req.query;

  const pipeline = [];
  const matchConditions = [{ status: "verified" }];
  Object.keys(req.query).forEach((key) => {
    if (
      key !== "page" &&
      key !== "limit" &&
      key !== "sortType" &&
      key !== "sortBy"
    ) {
      const value = req.query[key];
      console.log(value);

      if (key === "location") {
        const locations = value.split(",");
        matchConditions.push({ "location.name": { $in: locations } });
      } else if (key === "city" || key === "rent" || key === "title") {
        matchConditions.push({
          [key]: { $regex: new RegExp(value, "i") }, // Case-insensitive search
        });
      }

      // Add more conditions as needed for different fields
    }
  });

  // Apply all match conditions with $or
  pipeline.push({
    $match: { $or: matchConditions },
  });

  // Add sorting
  pipeline.push({
    $sort: {
      [sortBy]: sortType === "asc" ? 1 : -1,
    },
  });
  pipeline.push({
    $skip: (page - 1) * limit,
  });

  pipeline.push({
    $limit: parseInt(limit),
  });
  pipeline.push({
    $lookup: {
      from: "users", // The name of the User collection
      localField: "owner", // Field from Property collection
      foreignField: "_id", // Field from User collection
      as: "ownerDetails", // Output array field
    },
  });

  // Unwind the ownerDetails array to get a single object
  pipeline.push({
    $unwind: "$ownerDetails",
  });
  pipeline.push({
    $project: {
      title: 1,
      description: 1,
      city: 1,
      location: 1,
      images: 1,
      bed: 1,
      shower: 1,
      payper: 1,
      parking: 1,
      rent: 1,
      status: 1,
      createdAt: 1,
      "ownerDetails.email": 1,
      "ownerDetails.name": 1,
      "ownerDetails.city": 1,
      "ownerDetails.profileImage": 1,
    },
  });
  const propertyAggregate = Property.aggregate(pipeline);
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  try {
    const properties = await Property.aggregatePaginate(
      propertyAggregate,
      options
    );
    if (!properties) {
      return res.status(400).json({
        success: false,
        message: "Failed to fetch properties",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Property fetched successfully",
      data: properties,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Network Error",
    });
  }
});

const getMyProperties = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortType = "desc",
    sortBy = "createdAt",
  } = req.query;

  const pipeline = [];
  const matchConditions = [{ owner: req.user._id }];
  Object.keys(req.query).forEach((key) => {
    if (
      key !== "page" &&
      key !== "limit" &&
      key !== "sortType" &&
      key !== "sortBy"
    ) {
      const value = req.query[key];
      console.log(value);

      if (key === "location") {
        const locations = value.split(",");
        matchConditions.push({ "location.name": { $in: locations } });
      } else if (key === "status") {
        matchConditions.push({
          status: value,
        });
      } else if (key === "city" || key === "rent" || key === "title") {
        matchConditions.push({
          [key]: { $regex: new RegExp(value, "i") }, // Case-insensitive search
        });
      }
    }
  });

  // Apply all match conditions with $or
  pipeline.push({
    $match: { $and: matchConditions },
  });
  // if(req.query['status'])

  // Add sorting
  pipeline.push({
    $sort: {
      [sortBy]: sortType === "asc" ? 1 : -1,
    },
  });
  pipeline.push({
    $skip: (page - 1) * limit,
  });

  pipeline.push({
    $limit: parseInt(limit),
  });
  pipeline.push({
    $lookup: {
      from: "users", // The name of the User collection
      localField: "owner", // Field from Property collection
      foreignField: "_id", // Field from User collection
      as: "ownerDetails", // Output array field
    },
  });

  // Unwind the ownerDetails array to get a single object
  pipeline.push({
    $unwind: "$ownerDetails",
  });
  pipeline.push({
    $project: {
      title: 1,
      description: 1,
      city: 1,
      location: 1,
      images: 1,
      bed: 1,
      shower: 1,
      payper: 1,
      parking: 1,
      rent: 1,
      status: 1,
      createdAt: 1,
      "ownerDetails.email": 1,
      "ownerDetails.name": 1,
      "ownerDetails.city": 1,
      "ownerDetails.profileImage": 1,
    },
  });
  const myPropertyAggregate = Property.aggregate(pipeline);
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  try {
    const properties = await Property.aggregatePaginate(
      myPropertyAggregate,
      options
    );
    if (!properties) {
      return res.status(400).json({
        success: false,
        message: "Failed to fetch properties",
      });
    }
    return res.status(200).json({
      success: true,
      message: "My Property fetched successfully",
      data: properties,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Network Error",
    });
  }
});

const getPropertyDetails = asyncHandler(async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Use the aggregation pipeline to fetch property details and include only the owner fields required
    const property = await Property.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(propertyId) }, // Match the property by ID
      },
      {
        $lookup: {
          from: "users", // Assuming 'users' is the collection for property owners
          localField: "owner", // 'owner' is the reference field in the property schema
          foreignField: "_id",
          as: "owner", // Name for the joined owner data
        },
      },
      {
        $unwind: "$owner", // Unwind the owner array to make it an object
      },
      {
        $project: {
          propertyId: "$_id",
          propertyName: "$title", // Property title
          description: "$description", // Property description
          rent: "$rent", // Rent amount
          location: "$location", // Location details
          city: "$city", // City
          images: "$images", // Property images
          bed: "$bed", // Number of beds
          shower: "$shower", // Number of showers
          payper: "$payper", // Payment terms
          parking: "$parking", // Parking availability
          status: "$status", // Property status (verified/unverified)
          owner: {
            id: "$owner._id", // Owner's ID
            name: "$owner.name", // Owner's name
            email: "$owner.email", // Owner's email
          },
        },
      },
    ]);

    if (!property || property.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: property[0], // Return the first (and only) item in the result array
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});

const updateProperty = asyncHandler(async (req, res) => {
  try {
    const { propertyId } = req.params;
    const user = req.user;
    console.log(user);
    if (Object.keys(req.body).length < 1) {
      return res.status(400).json({
        success: false,
        message: "Missing Required Fields",
      });
    }
    //validation
    const reqBody = Object.keys(req.body);
    const validBody = [
      "title",
      "city",
      "location",
      "bed",
      "images",
      "payper",
      "parking",
      "rent",
      "description",
      "shower",
      "status",
    ];

    const isValidBody = reqBody.every((body) => validBody.includes(body));
    if (!isValidBody) {
      return res.status(400).json({
        success: false,
        message: "Invalid Body params",
      });
    }
    const existedProperty = await Property.findById(propertyId);
    if (!existedProperty) {
      return res.status(400).json({
        success: false,
        message: "Property not found",
      });
    }
    if (!existedProperty.owner.equals(user._id)) {
      return res.status(400).json({
        success: false,
        message: "Not authorized to update this property",
      });
    }
    const updateProperty = await Property.findByIdAndUpdate(
      existedProperty._id,
      req.body,
      { new: true }
    );
    if (!updateProperty) {
      return res.status(400).json({
        success: false,
        message: "Property failed to updated",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Property updated successfully",
      data: updateProperty,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Network Error",
    });
  }
});

const deleteProperty = asyncHandler(async (req, res) => {
  try {
    const { propertyId } = req.params;
    const user = req.user;
    const existedProperty = await Property.findById(propertyId);
    if (!existedProperty) {
      return res.status(400).json({
        success: false,
        message: "Property not found",
      });
    }
    if (!existedProperty.owner.equals(user._id)) {
      return res.status(400).json({
        success: false,
        message: "Not authorized to update this property",
      });
    }
    const deleteProperty = await Property.findByIdAndDelete(
      existedProperty._id
    );
    if (!deleteProperty) {
      return res.status(400).json({
        success: false,
        message: "Property failed to delete",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Property deleted successfully",
      data: null,
    });
  } catch (err) {
    // console.log(err,"====err====")
    return res.status(500).json({
      success: false,
      message: "Network Error",
    });
  }
});

const getDashboardAnalytics = asyncHandler(async (req, res) => {
  try {
    const result = await Promise.all([
      User.aggregate([
        {
          $facet: {
            totalUsers: [{ $count: "count" }],
          },
        },
        {
          $project: {
            totalUsers: {
              $ifNull: [{ $arrayElemAt: ["$totalUsers.count", 0] }, 0],
            },
          },
        },
      ]),
      Property.aggregate([
        {
          $facet: {
            totalProperties: [{ $count: "count" }],
            verifiedProperties: [
              { $match: { status: "verified" } },
              { $count: "count" },
            ],
            unverifiedProperties: [
              { $match: { status: "unverified" } },
              { $count: "count" },
            ],
          },
        },
        {
          $project: {
            totalProperties: {
              $ifNull: [{ $arrayElemAt: ["$totalProperties.count", 0] }, 0],
            },
            verifiedProperties: {
              $ifNull: [{ $arrayElemAt: ["$verifiedProperties.count", 0] }, 0],
            },
            unverifiedProperties: {
              $ifNull: [
                { $arrayElemAt: ["$unverifiedProperties.count", 0] },
                0,
              ],
            },
          },
        },
      ]),
    ]);

    const [userStats, propertyStats] = result;

    const analytics = {
      totalUsers: userStats[0]?.totalUsers || 0,
      totalProperties: propertyStats[0]?.totalProperties || 0,
      verifiedProperties: propertyStats[0]?.verifiedProperties || 0,
      unverifiedProperties: propertyStats[0]?.unverifiedProperties || 0,
    };

    return res.status(200).json({
      message: "Dashboard fetched",
      status: true,
      data: analytics,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal Server Error", ["Internal Server Error"])
      );
  }
});
export {
  createProperty,
  deleteProperty,
  getAllProperties,
  getMyProperties,
  getPropertyDetails,
  updateProperty,
  getDashboardAnalytics,
};
