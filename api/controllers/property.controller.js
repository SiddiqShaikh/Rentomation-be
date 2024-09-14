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

// const getAllProperties = asyncHandler(async (req, res) => {
//   const {
//     page = 1,
//     limit = 10,
//     sortType = "desc",
//     sortBy = "createdAt",
//   } = req.query;

//   const pipeline = [];
//   const matchConditions = [{ status: "verified" }];
//   Object.keys(req.query).forEach((key) => {
//     if (
//       key !== "page" &&
//       key !== "limit" &&
//       key !== "sortType" &&
//       key !== "sortBy"
//     ) {
//       const value = req.query[key];
//       console.log(value);

//       if (key === "location") {
//         const locations = value.split(",");
//         matchConditions.push({ "location.name": { $in: locations } });
//       } else if (key === "city" || key === "rent" || key === "title") {
//         matchConditions.push({
//           [key]: { $regex: new RegExp(value, "i") }, // Case-insensitive search
//         });
//       }

//       // Add more conditions as needed for different fields
//     }
//   });

//   // Apply all match conditions with $or
//   pipeline.push({
//     $match: { $or: matchConditions },
//   });

//   // Add sorting
//   pipeline.push({
//     $sort: {
//       [sortBy]: sortType === "asc" ? 1 : -1,
//     },
//   });
//   pipeline.push({
//     $skip: (page - 1) * limit,
//   });

//   pipeline.push({
//     $limit: parseInt(limit),
//   });
//   pipeline.push({
//     $lookup: {
//       from: "users", // The name of the User collection
//       localField: "owner", // Field from Property collection
//       foreignField: "_id", // Field from User collection
//       as: "ownerDetails", // Output array field
//     },
//   });

//   // Unwind the ownerDetails array to get a single object
//   pipeline.push({
//     $unwind: "$ownerDetails",
//   });
//   pipeline.push({
//     $project: {
//       title: 1,
//       description: 1,
//       city: 1,
//       location: 1,
//       images: 1,
//       bed: 1,
//       shower: 1,
//       payper: 1,
//       parking: 1,
//       rent: 1,
//       status: 1,
//       createdAt: 1,
//       "ownerDetails.email": 1,
//       "ownerDetails.name": 1,
//       "ownerDetails.city": 1,
//       "ownerDetails.profileImage": 1,
//     },
//   });
//   const propertyAggregate = Property.aggregate(pipeline);
//   const options = {
//     page: parseInt(page, 10),
//     limit: parseInt(limit, 10),
//   };

//   try {
//     const properties = await Property.aggregatePaginate(
//       propertyAggregate,
//       options
//     );
//     if (!properties) {
//       return res.status(400).json({
//         success: false,
//         message: "Failed to fetch properties",
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       message: "Property fetched successfully",
//       data: properties,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Network Error",
//     });
//   }
// });
const getAllProperties = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortType = "desc",
    sortBy = "createdAt",
    search = "",
    rentRange = "", // Rent range parameter
  } = req.query;

  const pipeline = [];
  const matchConditions = [{ status: "verified" }];

  if (search) {
    const searchRegex = new RegExp(search, "i");
    matchConditions.push({
      $or: [
        { "location.name": searchRegex },
        { city: searchRegex },
        { title: searchRegex },
      ],
    });
  }

  if (rentRange) {
    const [minRent, maxRent] = rentRange.split("-");
    matchConditions.push({
      rent: { $gte: parseInt(minRent, 10), $lte: parseInt(maxRent, 10) },
    });
  }

  pipeline.push({
    $match: { $and: matchConditions },
  });

  pipeline.push({
    $sort: {
      [sortBy]: sortType === "asc" ? 1 : -1,
    },
  });
  pipeline.push({
    $skip: (page - 1) * limit,
  });
  pipeline.push({
    $limit: parseInt(limit, 10),
  });
  pipeline.push({
    $lookup: {
      from: "users", // The name of the User collection
      localField: "owner", // Field from Property collection
      foreignField: "_id", // Field from User collection
      as: "ownerDetails", // Output array field
    },
  });

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

export { createProperty, getAllProperties, getMyProperties };
