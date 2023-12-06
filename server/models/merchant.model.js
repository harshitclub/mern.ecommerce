import mongoose, { Schema } from "mongoose";

const merchantSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Your Name is required."],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required."],
      trim: true,
    },
    phone: {
      type: Number,
      unique: true,
      required: [true, "Phone Number is required."],
    },
    gstin: {
      type: String,
      unique: true,
      required: true,
    },
    pan: {
      type: String,
      unique: true,
      required: [true, "PAN Number is required."],
    },
    storeName: {
      type: String,
      unique: true,
      required: [true, "Provide Store Name."],
    },
    storeDescription: {
      type: String,
      required: [true, "Provide Store Description."],
    },
    businessAddress: [
      {
        type: Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required."],
      min: [6, "Password must be at least 6 characters long."],
    },
    profileImage: {
      type: String,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    role: {
      type: String,
      default: "Merchant",
    },
    adminApproval: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Merchant = mongoose.model("Merchant", merchantSchema);

export default Merchant;
