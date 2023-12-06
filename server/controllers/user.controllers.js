import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const userRegister = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;
  if (!firstName && !lastName && !email && !phone && !password) {
    return res.status(500).send({
      success: false,
      message: "All Fields are required!",
    });
  }

  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "User already registered | login instead",
      });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
    });

    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      return res.status(500).send({
        success: false,
        message: "Somthing went wrong while registering the user",
      });
    }

    return res.status(201).json({
      success: true,
      message: "User Registered",
      createdUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In User Register API",
      error,
    });
  }
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

    // const accessToken = await user.generateAccessToken();
    // const refreshToken = await user.generateRefreshToken();

    // const verifyAccessToken = jwt.verify(
    //   accessToken,
    //   process.env.ACCESS_TOKEN_SECRET
    // );

    // const verifyRefreshToken = jwt.verify(
    //   refreshToken,
    //   process.env.REFRESH_TOKEN_SECRET
    // );

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
