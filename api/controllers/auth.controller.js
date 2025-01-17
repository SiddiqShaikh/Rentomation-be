import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { UserLoginValidation } from "../utils/schemaValidations/userValidation.js";

const generateToken = async (userId) => {
  const user = await User.findById(userId);
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { refreshToken };
};
const register = asyncHandler(async (req, res) => {
  try {
    if (Object.keys(req.body).length < 1) {
      return res.status(400).json({
        success: false,
        message: "Body required",
      });
    }

    const { username, cnic, email, password, city, role } = req.body;
    const existedUser = await User.findOne({
      $or: [{ email }],
    });
    if (existedUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    const createdUser = await User.create({
      email,
      cnic,
      username,
      password,
      city,
      role,
    });
    if (!createdUser) {
      return res.status(400).json({
        success: false,
        message: "Failed to create user",
      });
    }

    const user = await User.findById(createdUser._id).select("-password");
    return res.status(200).json({
      success: true,
      message: "User Created Successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Network Error",
    });
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    if (Object.keys(req.body).length < 1) {
      return res.status(400).json({
        success: false,
        message: "Body required",
      });
    }
    //validate required body here
    const reqBody = Object.keys(req.body);
    const validBody = ["email", "password"];

    const isValidBody = reqBody.every((body) => validBody.includes(body));
    if (!isValidBody) {
      return res.status(400).json({
        success: false,
        message: "Invalid Body params",
      });
    }
    //validation
    const { error } = UserLoginValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Missing required field(s)",
        error: `${error.details[0].path} error`,
      });
    }
    const { email, password } = req.body;
    const foundUser = await User.findOne({ $or: [{ email }] });
    if (!foundUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await foundUser.isPasswordCorrect(password);
    console.log(foundUser);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const { refreshToken } = await generateToken(foundUser._id);
    const options = {
      httpOnly: true,
      secure: true,
    };
    const loggedInUser = await User.findById(foundUser._id).select(
      "-password -refreshToken"
    );
    return res.status(200).cookie("refreshToken", refreshToken, options).json({
      success: true,
      message: "Login successfully",
      data: loggedInUser,
      token: refreshToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Network Error",
    });
  }
});

const getProfile = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    const foundUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!foundUser) {
      return res.status(400).json({
        success: false,
        message: "No User Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Profile Fetched successfully",
      data: foundUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Network Error",
    });
  }
});

const uploadOnCloudinaryImage = asyncHandler(async (req, res) => {
  try {
    if (!req.file?.path) {
      return res
        .status(400)
        .json(new ApiError(400, "Image is required", ["Image is required"]));
    }
    const localProfileImage = req.file?.path;

    if (!localProfileImage) {
      return res
        .status(400)
        .json(new ApiError(400, "Image is required", ["Image is required"]));
    }
    const profileUpload = await uploadOnCloudinary(localProfileImage);

    if (!profileUpload) {
      return res
        .status(400)
        .json(new ApiError(400, "Cloudinary Error::", ["Cloudinary Error::"]));
    }
    const sendReponse = {
      url: profileUpload.url,
      public_id: profileUpload.public_id,
    };
    return res.status(200).json({
      success: true,
      message: "Images Uploaded",
      data: sendReponse,
    });
  } catch (err) {
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal Server Error", ["Internal Server Error"])
      );
  }
});

export { getProfile, login, register, uploadOnCloudinaryImage };
