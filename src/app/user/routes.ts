import { Router } from "express";
import { getProfile, updateProfile } from "./controller";
import { verifyUser } from "../../middleware/auth";

const router = Router();

router.get("/profile", verifyUser, getProfile);
router.patch("/profile", verifyUser, updateProfile);

export default router;
