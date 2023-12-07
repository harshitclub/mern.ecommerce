import jwt from "jsonwebtoken";

export const verifyJwtToken = (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    console.log(error);
    throw new Error("Invalid Token!");
  }
};
