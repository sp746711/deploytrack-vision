import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    severity: { type: String, required: true, enum: ["critical", "warning", "info"], default: "info" },
    status: { type: String, default: "open", enum: ["open", "investigating", "resolved"], trim: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: null },
    service: { type: String, default: "", trim: true },
    assignee: { type: String, default: "", trim: true },
    affectedUsers: { type: Number, default: 0 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Incident = mongoose.model("Incident", incidentSchema);
export default Incident;
