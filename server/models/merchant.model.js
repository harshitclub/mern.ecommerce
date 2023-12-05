import mongoose, { Schema } from "mongoose";

const merchantSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    phone: {
      type: Number,
      unique: true,
      required: true,
    },
    gstin: {
      type: String,
      unique: true,
      required: true,
    },
    businessAddress: [
      {
        type: Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    password: {
      type: String,
      required: true,
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
