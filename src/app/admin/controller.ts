import { Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../user/model";
import { AuthRequest } from "../../types";
import { Surah, Ayah } from "../content/models";

export const getAdminDashboard = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [totalUsers, totalSurahs, totalAyahs] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Surah.countDocuments(),
      Ayah.countDocuments(),
    ]);
    res.json({ stats: { totalUsers, totalSurahs, totalAyahs } });
  } catch (error) {
    next(error);
  }
};

export const getAdminUsers = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await User.findByIdAndUpdate(id, { status }, { new: true }).select("-password");
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;
    const updated = await User.findByIdAndUpdate(id, { name, phone }, { new: true }).select("-password");
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const updateUserPassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.password = await bcrypt.hash(password, 12);
    await user.save();
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
