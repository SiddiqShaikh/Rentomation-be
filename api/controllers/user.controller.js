import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllUser = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortType = "desc",
    query,
    isVerified,
  } = req.query;

  const matchConditions = {};

  if (query) {
    matchConditions.$or = [
      { username: { $regex: new RegExp(query, "i") } },
      { email: { $regex: new RegExp(query, "i") } },
      { city: { $regex: new RegExp(query, "i") } },
    ];
  }

  const pipeline = [
    { $match: matchConditions },
    {
      $sort: { [sortBy]: sortType === "asc" ? 1 : -1 },
    },
    {
      $project: {
        password: 0,
        refreshToken: 0,
      },
    },
  ];

  const userAggregate = User.aggregate(pipeline);
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  try {
    const users = await User.aggregatePaginate(userAggregate, options);
    console.log(users, "usersusers");

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.log(error, "errorerror");

    return res.status(500).json({
      success: false,
      message: "Network Error",
    });
  }
});

export { getAllUser };