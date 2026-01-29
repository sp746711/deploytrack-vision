import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    deployment: { type: mongoose.Schema.Types.ObjectId, ref: "Deployment", required: true },
    level: { type: String, required: true, enum: ["info", "warn", "error", "debug"], default: "info" },
    service: { type: String, default: "", trim: true },
    message: { type: String, required: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Log = mongoose.model("Log", logSchema);
export default Log;
