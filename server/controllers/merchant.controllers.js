import { asyncHandler } from "../utils/asyncHandler.js";
import Merchant from "../models/merchant.model.js";

export const merchantRegister = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phone,
    gstin,
    pan,
    storeName,
    storeDescription,
    businessAddress,
    password,
  } = req.body;

  if (
    !fullName &&
    !email &&
    !phone &&
    !gstin &&
    !pan &&
    !storeName &&
    !storeDescription &&
    !businessAddress &&
    !password
  ) {
    return res.status(400).send({
      success: false,
      message: "All fields are required.",
    });
  }

  // Check for existing merchant
  const existingMerchant = await Merchant.findOne({ email: email });

  if (existingMerchant) {
    return res.status(409).send({
      success: false,
      message: "Merchant already registered. Please login.",
    });
  }

  // Create new mechant
  const newMerchant = await Merchant.create({
    fullName,
    email,
    phone,
    gstin,
    pan,
    storeName,
    storeDescription,
    businessAddress,
    password,
  });

  // Select specific fields excluding sensitive data
  const createdMerchant = await Merchant.findById(newMerchant._id).select(
    "-password -refreshToken"
  );

  // Respond with success message and user data
  res.status(201).json({
    success: true,
    message: "Merchant registered successfully.",
    data: createdMerchant,
  });
});

export const merchantLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      success: false,
      message: "Missing required fields: email and password",
    });
  }

  try {
    const merchant = await Merchant.findOne({ email }).select("+password");

    if (!merchant) {
      return res.status(401).send({
        success: false,
        message: "Invalid email address or merchant not registered",
      });
    }

    const isPasswordCorrect = await merchant.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return res.status(401).send({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const accessToken = await merchant.generateAccessToken();
    const refreshToken = await merchant.generateRefreshToken();

    merchant.refreshToken = refreshToken;
    await merchant.save();

    const options = {
      httpOnly: true,
      secure: true,
    };

    const loggedInMerchant = await Merchant.findById(merchant._id).select(
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
        user: loggedInMerchant,
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
