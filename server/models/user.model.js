import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: Number,
      unique: true,
      required: [true, "Phone Number is required."],
    },
    address: [
      {
        type: Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required."],
      min: [6, "Password must be at least 6 characters long."],
    },
    profileImage: {
      type: String,
    },
    cartItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    wishlistItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    role: {
      type: String,
      default: "User",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.firstName + " " + this.lastName,
      role: this.role,
      isVerified: this.isVerified,
      isActive: this.isActive,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.firstName + " " + this.lastName,
      role: this.role,
      isVerified: this.isVerified,
      isActive: this.isActive,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const User = mongoose.model("User", userSchema);

export default User;
