import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import Address from "../models/address.model.js";
import mongoose from "mongoose";

export const addAddress = asyncHandler(async (req, res) => {
  const {
    fullName,
    country,
    state,
    city,
    streetOne,
    streetTwo,
    landmark,
    addressType,
    contactNumber,
    pincode,
  } = req.body;

  if (
    !fullName &&
    !country &&
    !state &&
    !city &&
    !streetOne &&
    !addressType &&
    !contactNumber &&
    !pincode
  ) {
    return res.status(500).send({
      success: false,
      message: "All Fields are required!",
    });
  }
  const userId = "65702524bc65da3cacc6bc20";
  const checkUser = await User.findById(userId);

  if (!checkUser) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Unauthorized",
      error,
    });
  }
  try {
    const newAddress = new Address({
      fullName,
      country,
      state,
      city,
      streetOne,
      streetTwo,
      landmark,
      addressType,
      contactNumber,
      pincode,
      user: checkUser._id,
    });

    const session = await mongoose.startSession();
    session.startTransaction();
    await newAddress.save();
    await checkUser.address.push(newAddress);
    await checkUser.save();
    await session.commitTransaction();

    const createdAddress = await Address.findById(newAddress._id);
    if (!createdAddress) {
      return res.status(500).send({
        success: false,
        message: "Somthing went wrong while adding the address",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Address Added",
      createdAddress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Add Address API",
      error,
    });
  }
});
