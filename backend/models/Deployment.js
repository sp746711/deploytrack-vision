import mongoose from "mongoose";

const deploymentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    status: { type: String, required: true, enum: ["success", "pending", "failed"], default: "pending" },
    environment: { type: String, default: "production", trim: true },
    commit: { type: String, default: "", trim: true },
    message: { type: String, default: "", trim: true },
    author: { type: String, default: "", trim: true },
    duration: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

const Deployment = mongoose.model("Deployment", deploymentSchema);
export default Deployment;
