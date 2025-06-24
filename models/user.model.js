import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,

    unique: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
});

export const User = mongoose.model("User", userSchema);
