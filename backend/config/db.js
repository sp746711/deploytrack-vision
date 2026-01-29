import mongoose from "mongoose";

/**
 * MongoDB connection. Never crashes app on connection failure;
 * Mongoose will retry on first operation.
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/deploytrack";
    await mongoose.connect(uri);
    console.log("[DB] MongoDB connected");
  } catch (err) {
    console.error("[DB] MongoDB connection error:", err.message);
    // Do not throw – let server start; Mongoose will retry when used
  }
};

export default connectDB;
