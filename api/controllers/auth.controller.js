import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  UserLoginValidation,
  UserRegisterValidation,
} from "../utils/schemaValidations/userValidation.js";

const generateToken = async (userId) => {
  const user = await User.findById(userId);
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { refreshToken };
};
const register = asyncHandler(async (req, res) => {
  //username, nic, email, password, city
  try {
    if (Object.keys(req.body).length < 1) {
      return res.status(400).json({
        success: false,
        message: "Body required",
      });
    }
    //validate required body here
    const reqBody = Object.keys(req.body);
    const validBody = ["username", "cnic", "email", "password", "city"];

    const isValidBody = reqBody.every((body) => validBody.includes(body));
    if (!isValidBody) {
      return res.status(400).json({
        success: false,
        message: "Invalid Body params",
      });
    }
    const { value, error } = UserRegisterValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Missing required field(s)",
        error: `${error.details[0].path} error`,
      });
    }
    const { username, cnic, email, password, city } = req.body;
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
    console.log(foundUser)
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

export { register, login };
