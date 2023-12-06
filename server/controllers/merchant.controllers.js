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
    return res.status(500).send({
      success: false,
      message: "All Fields are required!",
    });
  }

  try {
    const existingMerchant = await Merchant.findOne({ email: email });

    if (existingMerchant) {
      return res.status(500).send({
        success: false,
        message: "Merchant already registered | login instead",
      });
    }

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

    const createdMerchant = await Merchant.findById(newMerchant._id).select(
      "-password -refreshToken"
    );
    if (!createdMerchant) {
      return res.status(500).send({
        success: false,
        message: "Somthing went wrong while registering the merchant",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Merchant Registered | Waiting for admin approval",
      createdMerchant,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Merchant Register API",
      error,
    });
  }
});

export const merchantLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return res.status(500).send({
      success: false,
      message: "Please provide email & password",
    });
  }

  try {
    const checkMerchant = await Merchant.findOne({ email: email });

    if (!checkMerchant) {
      return res.status(500).send({
        success: false,
        message: "Merchant not registered",
      });
    }

    const checkPassword = await checkMerchant.isPasswordCorrect(password);

    if (!checkPassword) {
      return res.status(500).send({
        success: false,
        message: "Invalid Credentials!",
      });
    }

    const merchant = await Merchant.findById(checkMerchant._id).select(
      "-password -refreshToken"
    );

    if (!merchant) {
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
      merchant,
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
