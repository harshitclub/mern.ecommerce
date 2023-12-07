import express from "express";
import { addProduct } from "../controllers/product.controllers.js";

const productRouter = express.Router();

productRouter.post("/add", addProduct);
productRouter.put("/update");
productRouter.delete("/delete");

export default productRouter;
