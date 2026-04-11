import { Router } from "express";
import { verifyUser } from "../../middleware/auth";
import { Feedback } from "../content/models";
import { AuthRequest } from "../../types";
import { Response, NextFunction } from "express";

const router = Router();

// Public: read feedbacks
router.get("/", async (_req, res: Response, next: NextFunction) => {
  try {
    const page = parseInt((_req.query.page as string) || "1");
    const limit = 10;
    const [feedbacks, total] = await Promise.all([
      Feedback.find()
        .populate("user_id", "name")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Feedback.countDocuments(),
    ]);
    res.json({ feedbacks, total, page, pages: Math.ceil(total / limit) });
  } catch (e) { next(e); }
});

// Auth: post feedback
router.post("/", verifyUser, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: "Content required" });
    const fb = await Feedback.create({ user_id: req.user!.userId, content });
    const populated = await fb.populate("user_id", "name");
    res.json(populated);
  } catch (e) { next(e); }
});

// Auth: delete own feedback
router.delete("/:id", verifyUser, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fb = await Feedback.findById(req.params.id);
    if (!fb) return res.status(404).json({ error: "Not found" });
    if (fb.user_id.toString() !== req.user!.userId && req.user!.role !== "admin")
      return res.status(403).json({ error: "Forbidden" });
    await fb.deleteOne();
    res.json({ success: true });
  } catch (e) { next(e); }
});

export default router;
