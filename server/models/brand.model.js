import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({});

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
