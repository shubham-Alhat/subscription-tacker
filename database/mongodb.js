import mongoose from "mongoose";
import { NODE_ENV, DB_URI } from "../config/env.js";

if (!DB_URI) {
  throw new Error(
    "Please define MONGODB_URI in .env.<production/development>.local file"
  );
}

const connectToDb = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`Connected to database in ${NODE_ENV} mode`);
  } catch (error) {
    console.log("MONGO_DB CONNECTION ERROR:", error);
    process.exit(1); // to exit the process
  }
};

export default connectToDb;
