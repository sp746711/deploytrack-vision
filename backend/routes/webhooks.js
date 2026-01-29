import { Router } from "express";
import crypto from "crypto";
import Project from "../models/Project.js";
import Deployment from "../models/Deployment.js";

const router = Router();

/**
 * POST /api/webhooks/projects/:projectId
 * Public webhook endpoint for CI/CD. Validates X-Webhook-Signature (HMAC of body with project webhookSecret).
 * Body: { name?, status?, environment?, commit?, message?, author?, duration? }
 */
router.post("/projects/:projectId", async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId).select("+webhookSecret");
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    const secret = project.webhookSecret || "";
    const sig = req.headers["x-webhook-signature"] || "";
    const raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
    const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
    if (sig !== expected && secret) {
      return res.status(401).json({ success: false, message: "Invalid webhook signature" });
    }

    const { name, status, environment, commit, message, author, duration } = req.body || {};
    const deployment = await Deployment.create({
      project: project._id,
      name: name != null ? String(name).trim() || "Webhook deployment" : "Webhook deployment",
      status: ["success", "pending", "failed"].includes(status) ? status : "pending",
      environment: environment != null ? String(environment).trim() || "production" : "production",
      commit: commit != null ? String(commit).trim() : "",
      message: message != null ? String(message).trim() : "",
      author: author != null ? String(author).trim() : "",
      duration: duration != null ? String(duration).trim() : "",
    });
    return res.status(201).json({ success: true, data: deployment });
  } catch (e) {
    next(e);
  }
});

export default router;
