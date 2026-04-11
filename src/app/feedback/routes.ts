import { Router } from "express";
import { verifyUser } from "../../middleware/auth";
import { getFeedbacks, createFeedback, deleteFeedback } from "./controller";

const router = Router();

router.get("/", getFeedbacks);
router.post("/", verifyUser, createFeedback);
router.delete("/:id", verifyUser, deleteFeedback);

export default router;
