import { Router } from "express";
import { verifyAdmin, verifyUser } from "../../middleware/auth";
import {
  getIntroductions, getIntroduction, upsertIntroduction, deleteIntroduction,
  getSurahs, getSurah, createSurah, updateSurah, deleteSurah,
  getAyahs, getAyah, createAyah, updateAyah, deleteAyah,
  getQuiz, upsertQuiz, deleteQuiz,
  getMyProgress, markIntroRead, submitQuiz,
} from "./controller";

const router = Router();

// Public / user content
router.get("/introductions", verifyUser, getIntroductions);
router.get("/introductions/:id", verifyUser, getIntroduction);
router.get("/surahs", verifyUser, getSurahs);
router.get("/surahs/:id", verifyUser, getSurah);
router.get("/surahs/:surahId/ayahs", verifyUser, getAyahs);
router.get("/ayahs/:id", verifyUser, getAyah);
router.get("/quiz", verifyUser, getQuiz);

// Progress
router.get("/progress", verifyUser, getMyProgress);
router.post("/progress/intro-read", verifyUser, markIntroRead);
router.post("/quiz/submit", verifyUser, submitQuiz);

// Admin content management
router.post("/admin/introduction", verifyAdmin, upsertIntroduction);
router.delete("/admin/introduction/:id", verifyAdmin, deleteIntroduction);
router.post("/admin/surahs", verifyAdmin, createSurah);
router.put("/admin/surahs/:id", verifyAdmin, updateSurah);
router.delete("/admin/surahs/:id", verifyAdmin, deleteSurah);
router.post("/admin/surahs/:surahId/ayahs", verifyAdmin, createAyah);
router.put("/admin/ayahs/:id", verifyAdmin, updateAyah);
router.delete("/admin/ayahs/:id", verifyAdmin, deleteAyah);
router.post("/admin/quiz", verifyAdmin, upsertQuiz);
router.delete("/admin/quiz/:id", verifyAdmin, deleteQuiz);

export default router;
