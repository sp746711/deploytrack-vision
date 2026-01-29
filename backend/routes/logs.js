import { Router } from "express";
import Log from "../models/Log.js";
import Deployment from "../models/Deployment.js";
import Project from "../models/Project.js";
import { auth } from "../middleware/auth.js";
import { success, error } from "../utils/response.js";

const router = Router();

router.use(auth);

/** GET /api/logs/:deploymentId – list logs for deployment (owner check via project) */
router.get("/:deploymentId", async (req, res, next) => {
  try {
    const dep = await Deployment.findById(req.params.deploymentId)
      .populate("project")
      .lean();
    if (!dep?.project) return error(res, "Deployment not found", 404);
    const proj = await Project.findOne({ _id: dep.project._id || dep.project, owner: req.user._id });
    if (!proj) return error(res, "Deployment not found", 404);

    const list = await Log.find({ deployment: req.params.deploymentId }).sort({ createdAt: 1 }).lean();
    return success(res, list);
  } catch (e) {
    next(e);
  }
});

/** POST /api/logs – create log entry (e.g. from webhooks) */
router.post("/", async (req, res, next) => {
  try {
    const { deployment: deploymentId, level, service, message } = req.body || {};
    const dep = await Deployment.findById(deploymentId).populate("project").lean();
    if (!dep?.project) return error(res, "Deployment not found", 404);
    const proj = await Project.findOne({
      _id: dep.project._id || dep.project,
      owner: req.user._id,
    });
    if (!proj) return error(res, "Deployment not found", 404);

    const log = await Log.create({
      deployment: deploymentId,
      level: ["info", "warn", "error", "debug"].includes(level) ? level : "info",
      service: service != null ? String(service).trim() : "",
      message: message != null ? String(message).trim() : "Log entry",
      owner: req.user._id,
    });
    return success(res, log.toObject ? log.toObject() : log, 201);
  } catch (e) {
    next(e);
  }
});

export default router;
