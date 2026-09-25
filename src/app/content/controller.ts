import { Response, NextFunction } from "express";
import { AuthRequest } from "../../types";
import { Introduction, Surah, Ayah, Quiz, UserProgress, QuizAttempt } from "./models";

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
    await Quiz.deleteMany({ content_type: "surah_intro", content_id: req.params.id });
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
    await Quiz.deleteMany({ content_type: "ayah", content_id: req.params.id });
    res.json({ success: true });
  } catch (e) { next(e); }
};

// ─── Quiz ────────────────────────────────────────────────────────────────────

export const getQuiz = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { content_type, content_id } = req.query;
    const quiz = await Quiz.findOne({ content_type, content_id });
    res.json(quiz || null);
  } catch (e) { next(e); }
};

export const upsertQuiz = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { content_type, content_id, questions } = req.body;
    const quiz = await Quiz.findOneAndUpdate(
      { content_type, content_id },
      { questions },
      { upsert: true, new: true }
    );
    res.json(quiz);
  } catch (e) { next(e); }
};

export const deleteQuiz = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { next(e); }
};

// ─── User Progress ────────────────────────────────────────────────────────────

export const getMyProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const progress = await UserProgress.findOne({ user_id: req.user!.userId })
      .populate("current_surah_id")
      .populate("current_ayah_id");
    res.json(progress || {
      unlocked_surahs: [],
      unlocked_ayahs: [],
      completed_quizzes: [],
      progress_percentage: 0,
    });
  } catch (e) { next(e); }
};

export const submitQuiz = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { quiz_id, answers } = req.body;
    const quiz = await Quiz.findById(quiz_id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    let correct = 0;
    const results = quiz.questions.map((q: any, i: number) => {
      const isCorrect = answers[i] === q.correct_answer;
      if (isCorrect) correct++;
      return { isCorrect, correct_answer: q.correct_answer, explanation_bn: q.explanation_bn, explanation_en: q.explanation_en };
    });

    const total = quiz.questions.length;
    const passed = correct === total;

    await QuizAttempt.create({ user_id: req.user!.userId, quiz_id, answers, score: correct, total, passed });

    if (passed) {
      const progress = await UserProgress.findOne({ user_id: req.user!.userId }) ||
        new UserProgress({ user_id: req.user!.userId });

      if (!progress.completed_quizzes.map((id: any) => id.toString()).includes(quiz_id.toString())) {
        progress.completed_quizzes.push(quiz_id);
      }

      if (quiz.content_type === "surah_intro") {
        const firstAyah = await Ayah.findOne({ surah_id: quiz.content_id }).sort({ ayah_number: 1 });
        if (firstAyah && !progress.unlocked_ayahs.map((id: any) => id.toString()).includes(firstAyah._id.toString())) {
          progress.unlocked_ayahs.push(firstAyah._id);
          progress.current_ayah_id = firstAyah._id;
        }
      } else if (quiz.content_type === "ayah") {
        const currentAyah = await Ayah.findById(quiz.content_id);
        if (currentAyah) {
          const nextAyah = await Ayah.findOne({ surah_id: currentAyah.surah_id, ayah_number: currentAyah.ayah_number + 1 });
          if (nextAyah) {
            if (!progress.unlocked_ayahs.map((id: any) => id.toString()).includes(nextAyah._id.toString())) {
              progress.unlocked_ayahs.push(nextAyah._id);
            }
            progress.current_ayah_id = nextAyah._id;
          } else {
            const currentSurah = await Surah.findById(currentAyah.surah_id);
            if (currentSurah) {
              const nextSurah = await Surah.findOne({ serial: currentSurah.serial + 1, isPublished: true });
              if (nextSurah && !progress.unlocked_surahs.map((id: any) => id.toString()).includes(nextSurah._id.toString())) {
                progress.unlocked_surahs.push(nextSurah._id);
                progress.current_surah_id = nextSurah._id;
                progress.current_ayah_id = null;
              }
            }
          }
        }
      }

      const totalQuizzes = await Quiz.countDocuments();
      progress.progress_percentage = totalQuizzes > 0
        ? Math.round((progress.completed_quizzes.length / totalQuizzes) * 100)
        : 0;
      progress.last_activity = new Date();
      await progress.save();
    }

    res.json({ passed, score: correct, total, results });
  } catch (e) { next(e); }
};
