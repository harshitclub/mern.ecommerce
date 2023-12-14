import { asyncHandler } from "../utils/asyncHandler.js";
import Category from "../models/category.model.js";

export const addCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  // Validate required field
  if (!name) {
    return res.status(400).send({
      success: false,
      message: "Missing required field: name",
    });
  }

  try {
    // Create new category
    const newCategory = await Category.create({ name });

    // No need to fetch again, use created object
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      // Handle validation errors (e.g., duplicate name)
      return res.status(400).send({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    } else if (error.code === 11000) {
      // Handle duplicate name error specifically
      return res.status(409).send({
        success: false,
        message: "Category name already exists",
      });
    } else {
      // Generic internal server error
      return res.status(500).send({
        success: false,
        message: "Internal server error",
        error,
      });
    }
  }
});
