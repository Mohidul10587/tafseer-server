import mongoose from "mongoose";

// Global Introduction — single document (singleton)
const introductionSchema = new mongoose.Schema({
  content_bn: { type: String, default: "" },
  content_en: { type: String, default: "" },
}, { timestamps: true });

// Surah
const surahSchema = new mongoose.Schema({
  name_ar: { type: String, required: true },
  name_bn: { type: String, required: true },
  name_en: { type: String, required: true },
  serial: { type: Number, required: true, unique: true },
  intro_bn: { type: String, default: "" },
  intro_en: { type: String, default: "" },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

// Ayah
const ayahSchema = new mongoose.Schema({
  surah_id: { type: mongoose.Schema.Types.ObjectId, ref: "Surah", required: true },
  ayah_number: { type: Number, required: true },
  arabic_text: { type: String, required: true },
  bn_translation: { type: String, default: "" },
  en_translation: { type: String, default: "" },
  bn_tafsir: { type: String, default: "" },
  en_tafsir: { type: String, default: "" },
}, { timestamps: true });
ayahSchema.index({ surah_id: 1, ayah_number: 1 }, { unique: true });

// Feedback
const feedbackSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export const Introduction = mongoose.models.Introduction || mongoose.model("Introduction", introductionSchema);
export const Surah = mongoose.models.Surah || mongoose.model("Surah", surahSchema);
export const Ayah = mongoose.models.Ayah || mongoose.model("Ayah", ayahSchema);
export const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);
