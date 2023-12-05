import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    streetOne: {
      type: String,
    },
    streetTwo: {
      type: String,
    },
    landmark: {
      type: String,
    },
    addressType: {
      type: String,
      enum: ["House", "Apartment", "Business"],
    },
    contactNumber: {
      type: String,
    },
    pincode: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("Address", addressSchema);

export default Address;
