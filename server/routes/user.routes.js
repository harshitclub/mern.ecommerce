import express from "express";
import {
  userLogin,
  userRegister,
  userUpdateProfile,
} from "../controllers/user.controllers.js";
import { auth } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.patch("/", auth, () => {
  console.log("done");
});

export default userRouter;
