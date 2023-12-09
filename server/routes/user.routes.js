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
userRouter.patch("/", auth, (req, res) => {
  console.log("done");
  res.status(200).json({ message: "Harshit is best!" });
});

export default userRouter;
