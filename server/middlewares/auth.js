import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyJwtToken } from "../utils/verifyJwtToken.js";
import User from "../models/user.model.js";

export const auth = asyncHandler(async (req, res, next) => {
  try {
    const accessToken = req.cookies.ecomAccess;

    if (!accessToken) {
      res.status(401);
      throw new Error("Please Login!");
    }

    // verify token
    const decodedAccessToken = verifyJwtToken(accessToken);

    if (!decodedAccessToken) {
      // Check if refresh token is present
      const refreshToken = req.cookies.ecomRefresh;

      if (!refreshToken) {
        res.status(401);
        throw new Error("Unauthorized! Missing Refresh Token");
      }

      // Verify refresh token
      const decodedRefreshToken = verifyJwtToken(refreshToken);

      if (!decodedRefreshToken) {
        res.status(401);
        throw new Error("Unauthorized! Invalid Refresh Token");
      }

      // Generate new access token using refresh token
      const user = await User.findById(decodedRefreshToken._id);

      if (!user) {
        res.status(404);
        throw new Error("User not found! Please Login");
      }

      const newAccessToken = await user.generateAccessToken();

      // Update access token cookie with new token
      res.cookie("ecomAccess", newAccessToken);
    }

    // User is authenticated
    req.user = await User.findById(decodedAccessToken._id);
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Unauthorized",
      error,
    });
  }
});
