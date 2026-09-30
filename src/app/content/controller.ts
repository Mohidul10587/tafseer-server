import { Response, NextFunction } from "express";
import { AuthRequest } from "../../types";
import { Introduction, Surah, Ayah } from "./models";

// ─── Introduction (singleton) ─────────────────────────────────────────────────

/** GET /content/introduction — return the single introduction document */
export const getIntroduction = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const intro = await Introduction.findOne();
    res.json(intro || null);
  } catch (e) { next(e); }
};

/** POST /content/admin/introduction — create or update the single introduction */
export const upsertIntroduction = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { content_bn, content_en } = req.body;
    const intro = await Introduction.findOneAndUpdate(
      {},
      { content_bn, content_en },
      { upsert: true, new: true }
    );
    res.json(intro);
  } catch (e) { next(e); }
};

// ─── Surah ───────────────────────────────────────────────────────────────────

export const getSurahs = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const surahs = await Surah.find().sort({ serial: 1 });
    res.json(surahs);
  } catch (e) { next(e); }
};

export const getSurah = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const surah = await Surah.findById(req.params.id);
    if (!surah) return res.status(404).json({ error: "Surah not found" });
    res.json(surah);
  } catch (e) { next(e); }
};

export const createSurah = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const surah = await Surah.create(req.body);
    res.json(surah);
  } catch (e) { next(e); }
};

export const updateSurah = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const surah = await Surah.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!surah) return res.status(404).json({ error: "Surah not found" });
    res.json(surah);
  } catch (e) { next(e); }
};

export const deleteSurah = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await Surah.findByIdAndDelete(req.params.id);
    await Ayah.deleteMany({ surah_id: req.params.id });
    res.json({ success: true });
  } catch (e) { next(e); }
};

// ─── Ayah ────────────────────────────────────────────────────────────────────

export const getAyahs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ayahs = await Ayah.find({ surah_id: req.params.surahId }).sort({ ayah_number: 1 });
    res.json(ayahs);
  } catch (e) { next(e); }
};

export const getAyah = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ayah = await Ayah.findById(req.params.id);
    if (!ayah) return res.status(404).json({ error: "Ayah not found" });
    res.json(ayah);
  } catch (e) { next(e); }
};

export const createAyah = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ayah = await Ayah.create({ ...req.body, surah_id: req.params.surahId });
    res.json(ayah);
  } catch (e) { next(e); }
};

export const updateAyah = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ayah = await Ayah.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ayah) return res.status(404).json({ error: "Ayah not found" });
    res.json(ayah);
  } catch (e) { next(e); }
};

export const deleteAyah = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await Ayah.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { next(e); }
};
