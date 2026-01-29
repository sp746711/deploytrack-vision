import { Router } from "express";
import Deployment from "../models/Deployment.js";
import Project from "../models/Project.js";
import { auth } from "../middleware/auth.js";
import { success, error } from "../utils/response.js";

const router = Router();

router.use(auth);

/** GET /api/deployments/:projectId – list deployments for project (owner check) */
router.get("/:projectId", async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId, owner: req.user._id });
    if (!project) return error(res, "Project not found", 404);

    const list = await Deployment.find({ project: project._id }).sort({ createdAt: -1 }).lean();
    return success(res, list);
  } catch (e) {
    next(e);
  }
});

/** POST /api/deployments – create deployment (optional, for webhooks/testing) */
router.post("/", async (req, res, next) => {
  try {
    const { project: projectId, name, status, environment, commit, message, author, duration } = req.body || {};
    const proj = await Project.findOne({ _id: projectId, owner: req.user._id });
    if (!proj) return error(res, "Project not found", 404);

    const deployment = await Deployment.create({
      project: proj._id,
      name: name != null ? String(name).trim() || "Deployment" : "Deployment",
      status: ["success", "pending", "failed"].includes(status) ? status : "pending",
      environment: environment != null ? String(environment).trim() || "production" : "production",
      commit: commit != null ? String(commit).trim() : "",
      message: message != null ? String(message).trim() : "",
      author: author != null ? String(author).trim() : "",
      duration: duration != null ? String(duration).trim() : "",
    });
    return success(res, deployment.toObject ? deployment.toObject() : deployment, 201);
  } catch (e) {
    next(e);
  }
});

export default router;
