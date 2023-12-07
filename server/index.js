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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2001;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/merchant", merchantRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/category", categoryRouter);
// app.use("/api/v1/brand");
// app.use("/api/v1/review");
app.use("/api/v1/address", addressRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started at: ${PORT}`);
  });
});
