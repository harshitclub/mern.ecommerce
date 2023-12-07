import express from "express";
import { addAddress } from "../controllers/address.controllers.js";

const addressRouter = express.Router();

addressRouter.post("/add", addAddress);

export default addressRouter;
