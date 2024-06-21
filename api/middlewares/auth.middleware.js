import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.header("x-auth-token")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "token:: Unauthorized request",
      });
    }
    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(403).json({
            success: false,
            message: "token:: Unauthorized request",
          });
        }
        const user = await User.findById(decoded.id);

        if (!user) {
          return res.status(401).json({
            success: false,
            message: "token:: Unauthorized request",
          });
        }
        req.user = user;

        next();
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Network Error",
    });
  }
});
