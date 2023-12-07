import express from "express";
import { addCategory } from "../controllers/category.controllers.js";

const categoryRouter = express.Router();

categoryRouter.post("/add", addCategory);

export default categoryRouter;
