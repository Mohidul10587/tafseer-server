import mongoose from "mongoose";

// Introduction (Global)
const introductionSchema = new mongoose.Schema({
  title_bn: { type: String, default: "" },
  title_en: { type: String, default: "" },
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

// Quiz

const questionSchema = new mongoose.Schema({
  question_text_bn: { type: String, default: "" },
  question_text_en: { type: String, default: "" },
  options: [new mongoose.Schema({
    text_bn: { type: String, default: "" },
    text_en: { type: String, default: "" },
  })],
  correct_answer: { type: Number, required: true, default: 0 }, // index of correct option
  explanation_bn: { type: String, default: "" },
  explanation_en: { type: String, default: "" },
});

const quizSchema = new mongoose.Schema({
  content_type: { type: String, enum: ["intro", "surah_intro", "ayah"], required: true },
  content_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  questions: [questionSchema],
}, { timestamps: true });
quizSchema.index({ content_type: 1, content_id: 1 }, { unique: true });

// User Progress
const userProgressSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  intro_read: { type: Boolean, default: false },
  intro_quiz_passed: { type: Boolean, default: false },
  current_surah_id: { type: mongoose.Schema.Types.ObjectId, ref: "Surah", default: null },
  current_ayah_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ayah", default: null },
  completed_quizzes: [{ type: mongoose.Schema.Types.ObjectId }], // quiz IDs
  unlocked_surahs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Surah" }],
  unlocked_ayahs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ayah" }],
  // set when user passes an ayah quiz but the next ayah doesn't exist yet
  pending_next_ayah: {
    surah_id: { type: mongoose.Schema.Types.ObjectId, ref: "Surah", default: null },
    ayah_number: { type: Number, default: null },
  },
  progress_percentage: { type: Number, default: 0 },
  last_activity: { type: Date, default: Date.now },
}, { timestamps: true });

// Quiz Attempts
const quizAttemptSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quiz_id: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  answers: [{ type: Number }], // selected option index per question
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  passed: { type: Boolean, required: true },
}, { timestamps: true });

// Feedback
const feedbackSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export const Introduction = mongoose.models.Introduction || mongoose.model("Introduction", introductionSchema);
export const Surah = mongoose.models.Surah || mongoose.model("Surah", surahSchema);
export const Ayah = mongoose.models.Ayah || mongoose.model("Ayah", ayahSchema);
export const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);
export const UserProgress = mongoose.models.UserProgress || mongoose.model("UserProgress", userProgressSchema);
export const QuizAttempt = mongoose.models.QuizAttempt || mongoose.model("QuizAttempt", quizAttemptSchema);
export const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);
