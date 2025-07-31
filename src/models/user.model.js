import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      tolower: true,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      required: true,
      enum: ["teacher", "admin"],
      default: "teacher",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({_id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};

export const User = mongoose.model("User", userSchema);
