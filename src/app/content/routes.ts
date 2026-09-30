import { Router } from "express";
import { verifyAdmin, verifyUser } from "../../middleware/auth";
import {
  getIntroduction,
  upsertIntroduction,
  getSurahs,
  getSurah,
  createSurah,
  updateSurah,
  deleteSurah,
  getAyahs,
  getAyah,
  createAyah,
  updateAyah,
  deleteAyah,
} from "./controller";

const router = Router();

// Public / user content
router.get("/introduction", verifyUser, getIntroduction);
router.get("/surahs", getSurahs);
router.get("/surahs/:id", getSurah);
router.get("/surahs/:surahId/ayahs", getAyahs);
router.get("/ayahs/:id", getAyah);
// Admin content management
router.post("/admin/introduction", verifyAdmin, upsertIntroduction);
router.post("/admin/surahs", verifyAdmin, createSurah);
router.put("/admin/surahs/:id", verifyAdmin, updateSurah);
router.delete("/admin/surahs/:id", verifyAdmin, deleteSurah);
router.post("/admin/surahs/:surahId/ayahs", verifyAdmin, createAyah);
router.put("/admin/ayahs/:id", verifyAdmin, updateAyah);
router.delete("/admin/ayahs/:id", verifyAdmin, deleteAyah);

export default router;
