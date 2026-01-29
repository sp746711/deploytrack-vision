import { Router } from "express";
import Project from "../models/Project.js";
import { auth } from "../middleware/auth.js";
import { success, error } from "../utils/response.js";

const router = Router();

/** All project routes require auth. */
router.use(auth);

/** Base URL for webhook URLs (e.g. http://localhost:5000) */
const getBaseUrl = (req) => {
  const host = req.get("host") || "localhost:5000";
  const proto = req.get("x-forwarded-proto") || req.protocol || "http";
  return `${proto}://${host}`;
};

/** GET /api/projects – list projects for req.user. Each includes webhookUrl for UI. */
router.get("/", async (req, res, next) => {
  try {
    const list = await Project.find({ owner: req.user._id })
      .select("-webhookSecret")
      .sort({ createdAt: -1 })
      .lean();
    const base = getBaseUrl(req);
    const withWebhook = list.map((p) => ({ ...p, webhookUrl: `${base}/api/webhooks/projects/${p._id}` }));
    return success(res, withWebhook);
  } catch (e) {
    next(e);
  }
});

/** POST /api/projects – create project. Only name/description from frontend; webhookSecret auto-generated. */
router.post("/", async (req, res, next) => {
  try {
    const { name, description } = req.body || {};
    const trimmedName = name != null ? String(name).trim() : "";
    const trimmedDesc = description != null ? String(description).trim() : "";

    if (!trimmedName) {
      return error(res, "Project name is required", 400);
    }

    const project = await Project.create({
      name: trimmedName,
      description: trimmedDesc,
      owner: req.user._id,
    });

    const doc = project.toObject ? project.toObject() : project;
    delete doc.webhookSecret;
    const base = getBaseUrl(req);
    doc.webhookUrl = `${base}/api/webhooks/projects/${doc._id}`;
    return success(res, doc, 201);
  } catch (e) {
    next(e);
  }
});

export default router;
