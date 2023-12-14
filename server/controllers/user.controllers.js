import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";

export const userRegister = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !phone || !password) {
    return res.status(400).send({
      success: false,
      message: "All fields are required.",
    });
  }

  // Check for existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).send({
      success: false,
      message: "User already registered. Please login.",
    });
  }

  // Create new user
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
  });

  // Select specific fields excluding sensitive data
  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  // Respond with success message and user data
  res.status(201).json({
    success: true,
    message: "User registered successfully.",
    data: createdUser,
  });
});

export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validate request body
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Missing required fields: email and password",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found with this email address",
      });
    }

    // Validate password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate tokens
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    // Update user with refresh token
    user.refreshToken = refreshToken;
    await user.save();

    const options = {
      httpOnly: true,
      secure: true,
    };

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    // Send successful login response
    return res
      .status(200)
      .cookie(`ecomAccess`, accessToken, options)
      .cookie(`ecomRefresh`, refreshToken, options)
      .json({
        success: true,
        message: "Login successful",
        user: loggedInUser,
      });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res.status(400).send({
        success: false,
        message: "Validation error",
        error: error.errors,
      });
    } else if (error.name === "MongoError" && error.code === 11000) {
      // Handle duplicate email error (if applicable)
      return res.status(409).send({
        success: false,
        message: "Email address already exists",
      });
    } else {
      return res.status(500).send({
        success: false,
        message: "Internal server error",
        error,
      });
    }
  }
});

export const userUpdateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName } = req.body;
});
