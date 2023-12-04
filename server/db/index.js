import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../constants.js";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n DB Connected | DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("DB Error: ", error);
    process.exit(1);
  }
};

export default connectDB;
