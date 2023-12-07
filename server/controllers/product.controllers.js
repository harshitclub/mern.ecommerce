import Product from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Category from "../models/category.model.js";
import Merchant from "../models/merchant.model.js";
import mongoose from "mongoose";

export const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    slug,
    pricing: { currency, price, salePrice },
    stock,
    totalUnits,
    options: [{ H, L, W, color }],
    category,
  } = req.body;
  const merchantId = "65705c8141754858ac69267d";
  const findMerchant = await Merchant.findById(merchantId);
  const findCategory = await Category.findById(category);

  try {
    const newProduct = await Product({
      name,
      description,
      slug,
      pricing: { currency, price, salePrice },
      stock,
      totalUnits,
      options: [{ H, L, W, color }],
      category,
      merchant: merchantId,
    });

    const session = await mongoose.startSession();
    session.startTransaction();
    await newProduct.save();
    findCategory.products.push(newProduct);
    findMerchant.products.push(newProduct);
    await findCategory.save();
    await findMerchant.save();
    await session.commitTransaction();

    const createdProduct = await Product.findById(newProduct._id);
    if (!createdProduct) {
      return res.status(500).send({
        success: false,
        message: "Somthing went wrong while creating the product",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Product Created",
      createdProduct,
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
