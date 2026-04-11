import { Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "./model";
import { AuthRequest } from "../../types";

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const { name, profileImage, password, oldPassword } = req.body;

    const update: any = {};
    if (name) update.name = name;
    if (profileImage) update.profileImage = profileImage;

    if (password) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });
      const valid = await bcrypt.compare(oldPassword || "", user.password);
      if (!valid) return res.status(400).json({ error: "Old password is incorrect" });
      update.password = await bcrypt.hash(password, 12);
    }

    await User.findByIdAndUpdate(userId, update);
    res.json({ message: "Profile updated" });
  } catch (error) {
    next(error);
  }
};
