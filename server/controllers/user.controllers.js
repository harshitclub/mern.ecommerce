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

  if (!email && !password) {
    return res.status(500).send({
      success: false,
      message: "Please provide email & password",
    });
  }

  try {
    const checkUser = await User.findOne({ email: email });

    if (!checkUser) {
      return res.status(500).send({
        success: false,
        message: "User not registered",
      });
    }

    const checkPassword = await checkUser.isPasswordCorrect(password);

    if (!checkPassword) {
      return res.status(500).send({
        success: false,
        message: "Invalid Credentials!",
      });
    }

    const user = await User.findById(checkUser._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(500).send({
        success: false,
        message: "Somthing Wrong While Login",
      });
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("ecomToken", accessToken);

    return res.status(200).json({
      success: true,
      message: "Login Success!",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In User Login API",
      error,
    });
  }
});

export const userUpdateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName } = req.body;
});
