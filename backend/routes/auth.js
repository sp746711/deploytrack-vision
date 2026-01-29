import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { success, error } from "../utils/response.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

/** POST /api/auth/signup – create user, return { token, user } */
router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return error(res, "Name, email and password are required", 400);
    }
    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim().toLowerCase();
    const trimmedPassword = String(password);

    if (trimmedPassword.length < 6) {
      return error(res, "Password must be at least 6 characters", 400);
    }

    const existing = await User.findOne({ email: trimmedEmail });
    if (existing) return error(res, "Email already registered", 409);

    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password: trimmedPassword,
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;
    return success(res, { token, user: { _id: userObj._id, name: userObj.name, email: userObj.email } });
  } catch (e) {
    next(e);
  }
});

/** POST /api/auth/login – validate credentials, return { token, user } */
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return error(res, "Email and password are required", 400);
    }
    const trimmedEmail = String(email).trim().toLowerCase();

    const user = await User.findOne({ email: trimmedEmail }).select("+password");
    if (!user) return error(res, "Invalid email or password", 401);

    const valid = await user.comparePassword(String(password));
    if (!valid) return error(res, "Invalid email or password", 401);

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;
    return success(res, { token, user: { _id: userObj._id, name: userObj.name, email: userObj.email } });
  } catch (e) {
    next(e);
  }
});

export default router;
