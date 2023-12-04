import express from "express";

const userRouter = express.Router();

userRouter.post("/register");
userRouter.post("/login");
userRouter.post("/profile");
userRouter.get("/logout");
userRouter.put("/profile-update");
userRouter.put("/password-update");
userRouter.put("/picture-update");
userRouter.post("/password-reset");

export default userRouter;
