import mongoose, { Schema } from "mongoose";

const brandSchema = new Schema({});

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
