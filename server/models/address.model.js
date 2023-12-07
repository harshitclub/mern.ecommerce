import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: function () {
        return this.addressType === "Business" ? "Merchant" : "User";
      },
      required: true,
    },
    fullName: {
      type: String,
      required: [true, "Name is required."],
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    streetOne: {
      type: String,
      required: true,
    },
    streetTwo: {
      type: String,
      default: "",
    },
    landmark: {
      type: String,
      default: "",
    },
    addressType: {
      type: String,
      enum: ["House", "Apartment", "Business"],
      required: true,
    },
    contactNumber: {
      type: Number,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("Address", addressSchema);

export default Address;
