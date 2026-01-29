import { Router } from "express";
import Incident from "../models/Incident.js";
import { auth } from "../middleware/auth.js";
import { success, error } from "../utils/response.js";

const router = Router();

router.use(auth);

/** GET /api/incidents – list incidents for req.user */
router.get("/", async (req, res, next) => {
  try {
    const list = await Incident.find({ owner: req.user._id }).sort({ createdAt: -1 }).lean();
    return success(res, list);
  } catch (e) {
    next(e);
  }
});

/** POST /api/incidents – create incident */
router.post("/", async (req, res, next) => {
  try {
    const { title, description, severity, status, project, service, assignee, affectedUsers } = req.body || {};
    const trimmedTitle = title != null ? String(title).trim() : "";
    if (!trimmedTitle) return error(res, "Title is required", 400);

    const incident = await Incident.create({
      title: trimmedTitle,
      description: description != null ? String(description).trim() : "",
      severity: ["critical", "warning", "info"].includes(severity) ? severity : "info",
      status: ["open", "investigating", "resolved"].includes(status) ? status : "open",
      project: project || null,
      service: service != null ? String(service).trim() : "",
      assignee: assignee != null ? String(assignee).trim() : "",
      affectedUsers: typeof affectedUsers === "number" ? affectedUsers : 0,
      owner: req.user._id,
    });
    return success(res, incident.toObject ? incident.toObject() : incident, 201);
  } catch (e) {
    next(e);
  }
});

/** PUT /api/incidents/:id – update incident */
router.put("/:id", async (req, res, next) => {
  try {
    const incident = await Incident.findOne({ _id: req.params.id, owner: req.user._id });
    if (!incident) return error(res, "Incident not found", 404);

    const { title, description, severity, status, service, assignee, affectedUsers } = req.body || {};
    if (title != null) incident.title = String(title).trim();
    if (description != null) incident.description = String(description).trim();
    if (["critical", "warning", "info"].includes(severity)) incident.severity = severity;
    if (["open", "investigating", "resolved"].includes(status)) incident.status = status;
    if (service != null) incident.service = String(service).trim();
    if (assignee != null) incident.assignee = String(assignee).trim();
    if (typeof affectedUsers === "number") incident.affectedUsers = affectedUsers;
    await incident.save();
    return success(res, incident.toObject ? incident.toObject() : incident);
  } catch (e) {
    next(e);
  }
});

export default router;
