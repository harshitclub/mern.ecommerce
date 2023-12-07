import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
    },
    images: [
      {
        type: String,
      },
    ],
    pricing: {
      currency: {
        type: String,
        enum: ["INR", "USD"],
      },
      price: Number,
      salePrice: Number,
    },
    stock: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
    },
    totalUnits: {
      type: Number,
    },
    options: [
      {
        H: String,
        L: String,
        W: String,
        color: String,
      },
    ],
    category: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },
    merchant: {
      type: Schema.Types.ObjectId,
      ref: "Merchant",
      required: true,
    },
    adminApproval: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
