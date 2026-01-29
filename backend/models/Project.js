import mongoose from "mongoose";
import crypto from "crypto";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    /** Backend-only: auto-generated webhook secret. Never sent from frontend. */
    webhookSecret: { type: String, default: () => crypto.randomBytes(32).toString("hex"), select: false },
    status: { type: String, default: "active", enum: ["active", "archived"], trim: true },
  },
  { timestamps: true }
);

/** Ensure webhookSecret exists on create; frontend never sends it. */
projectSchema.pre("save", function (next) {
  if (this.isNew && !this.webhookSecret) {
    this.webhookSecret = crypto.randomBytes(32).toString("hex");
  }
  next();
});

const Project = mongoose.model("Project", projectSchema);
export default Project;
