import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyJwtToken } from "../utils/verifyJwtToken.js";
import User from "../models/user.model.js";

export const auth = asyncHandler(async (req, res, next) => {
  try {
    const accessToken = req.cookies.ecomToken;

    if (!accessToken) {
      res.status(404);
      throw new Error("Please Login!");
    }

    // verify token

    const verifyAccessToken = verifyJwtToken(accessToken);

    if (!verifyAccessToken) {
      res.status(401);
      throw new Error("Unauthorized! Invalid Token");
    }

    const user = await User.findById(verifyAccessToken._id);

    if (!user) {
      res.status(404);
      throw new Error("Unauthorized! Please Login");
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Unauthorize",
      error,
    });
  }
});
