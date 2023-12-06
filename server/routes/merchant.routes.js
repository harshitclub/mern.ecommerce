import express from "express";
import {
  merchantLogin,
  merchantRegister,
} from "../controllers/merchant.controllers.js";

const merchantRouter = express.Router();

merchantRouter.post("/register", merchantRegister);
merchantRouter.post("/login", merchantLogin);

export default merchantRouter;
