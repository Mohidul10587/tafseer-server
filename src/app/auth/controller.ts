import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../user/model";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(401).json({ error: "Invalid phone number" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Invalid password" });

    if (user.status !== "active")
      return res.status(403).json({ error: "Account is inactive" });

    const token = jwt.sign({ userId: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, COOKIE_OPTIONS);
    res.json({ user: { _id: user._id, phone: user.phone, name: user.name, role: user.role } });
  } catch (error) {
    next(error);
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.json({ success: true });
};

export const me = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.status !== "active") return res.status(403).json({ error: "Account is inactive" });
    res.json({ _id: user._id, phone: user.phone, name: user.name, role: user.role });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phone, password, name } = req.body;
    const existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ error: "Phone number already registered" });

    const user = await User.create({ phone, password, name, role: "user" });
    res.json({ user: { _id: user._id, phone: user.phone, name: user.name, role: user.role } });
  } catch (error) {
    next(error);
  }
};
