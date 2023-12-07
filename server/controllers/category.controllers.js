import { asyncHandler } from "../utils/asyncHandler.js";
import Category from "../models/category.model.js";

export const addCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(500).send({
      success: false,
      message: "Category name is required!",
    });
  }

  try {
    const newCategory = await Category.create({
      name,
    });

    const createdCategory = await Category.findById(newCategory._id);
    if (!createdCategory) {
      return res.status(500).send({
        success: false,
        message: "Somthing went wrong while creating category",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Category Created!",
      createdCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while creating the category",
      error,
    });
  }
});
