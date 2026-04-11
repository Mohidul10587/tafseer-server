import { Router } from "express";
import { getAdminDashboard, getAdminUsers, updateUserStatus, updateUser, updateUserPassword } from "./controller";
import { verifyAdmin } from "../../middleware/auth";

const router = Router();

router.get("/dashboard", verifyAdmin, getAdminDashboard);
router.get("/users", verifyAdmin, getAdminUsers);
router.patch("/users/:id", verifyAdmin, updateUserStatus);
router.put("/users/:id", verifyAdmin, updateUser);
router.put("/users/:id/password", verifyAdmin, updateUserPassword);

export default router;
