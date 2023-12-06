import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    pricing: {
      currency: {
        type: String,
        enum: ["INR", "USD"],
        required: true,
      },
      price: Number,
      salePrice: Number,
      required: true,
    },
    stock: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      required: true,
    },
    totalUnits: {
      type: Number,
      required: true,
    },
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
      required: true,
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
