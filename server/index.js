import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./db/index.js";
import userRouter from "./routes/user.routes.js";
import merchantRouter from "./routes/merchant.routes.js";
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import addressRouter from "./routes/address.routes.js";

// configuring the dotenv module to access the .env file
dotenv.config();

// assigning express to the app variable
const app = express();

// setting the port variable
const PORT = process.env.PORT || 2001;

// using express.json() middleware to accept json data
app.use(express.json());

// using cors() middleware to accept data from cross origin
app.use(cors());

// using cookieParser() middleware to set cookie to the frontend
app.use(cookieParser());

// using Express.urlencoded() that expects request data to be sent encoded in the URL, usually in strings or arrays
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// user route middleware
app.use("/api/v1/user", userRouter);

// merchant route middleware
app.use("/api/v1/merchant", merchantRouter);

// product route middleware
app.use("/api/v1/product", productRouter);

// category route middleware
app.use("/api/v1/category", categoryRouter);

// brand route middleware
// app.use("/api/v1/brand");

// review route middleware
// app.use("/api/v1/review");

// address route middleware
app.use("/api/v1/address", addressRouter);

// now using connectDB to connect the database then listening the port
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started at: ${PORT}`);
  });
});
