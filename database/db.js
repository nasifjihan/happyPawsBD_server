import mongoose from "mongoose";
import { env } from "../config/env.js";

const Connection = async () => {
  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error.message);
    throw error;
  }
};

export default Connection;
