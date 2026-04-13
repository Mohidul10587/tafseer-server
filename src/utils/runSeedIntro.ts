import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const introductionSchema = new mongoose.Schema({
  serial: { type: Number, required: true, unique: true },
  title_bn: { type: String, default: "" },
  title_en: { type: String, default: "" },
  content_bn: { type: String, default: "" },
  content_en: { type: String, default: "" },
}, { timestamps: true });

const Introduction = mongoose.model("Introduction", introductionSchema);

const PARTS = [
  { serial: 1,  title_bn: "প্রকাশনা ও ভূমিকার পটভূমি",                          title_en: "Publisher's Note & Background",                    file: "part-01-প্রকাশনা-ও-ভূমিকার-পটভূমি.txt" },
  { serial: 2,  title_bn: "তাফসীর লিখার উদ্দেশ্য ও কুরআনের ভাষা",               title_en: "Purpose of Tafsir & Quranic Language",             file: "part-02-তাফসীর-লিখার-উদ্দেশ্য-ও-কুরআনের-ভাষা.txt" },
  { serial: 3,  title_bn: "কুরআনের যোগসূত্র — পক্ষে-বিপক্ষে আলোচনা",            title_en: "Quranic Coherence (Nazm) — For & Against",         file: "part-03-কুরআনের-যোগসূত্র-পক্ষে-বিপক্ষে.txt" },
  { serial: 4,  title_bn: "যোগসূত্রের গুরুত্ব ও সংশয়ের জবাব",                   title_en: "Importance of Nazm & Answers to Doubts",           file: "part-04-যোগসূত্রের-গুরুত্ব-ও-সংশয়ের-জবাব.txt" },
  { serial: 5,  title_bn: "কুরআনের সাত গ্রুপ কাঠামো ও সূরাসমূহের বিন্যাস",      title_en: "Seven-Group Structure of the Quran",               file: "part-05-কুরআনের-সাত-গ্রুপ-কাঠামো.txt" },
  { serial: 6,  title_bn: "হাদীস, শানেনুযূল এবং কুরআন বুঝার বাহ্যিক উৎস",       title_en: "Hadith, Shan-e-Nuzul & External Sources",          file: "part-06-হাদীস-শানেনুযূল-ও-বাহ্যিক-উৎস.txt" },
  { serial: 7,  title_bn: "তাফসীর গ্রন্থের পদ্ধতি, তাওরাত-ইঞ্জিল ও ঐতিহাসিক উৎস", title_en: "Tafsir Methodology & Historical Sources",        file: "part-07-তাফসীর-পদ্ধতি-ও-ইতিহাস-উৎস.txt" },
  { serial: 8,  title_bn: "কুরআন থেকে উপকার লাভের শর্ত — নিয়ত ও দৃষ্টিভঙ্গি",  title_en: "Conditions for Benefiting from the Quran",         file: "part-08-কুরআন-থেকে-উপকার-লাভের-শর্ত.txt" },
  { serial: 9,  title_bn: "তাদাব্বুর, চিন্তা-গবেষণা ও আল্লাহর কাছে দোয়া",       title_en: "Tadabbur, Reflection & Supplication to Allah",     file: "part-09-তাদাব্বুর-ও-আল্লাহর-কাছে-দোয়া.txt" },
  { serial: 10, title_bn: "সমাপনী বক্তব্য — তাফসীর গ্রন্থ সম্পর্কে বিশেষ বক্তব্য", title_en: "Closing Remarks on the Tafsir Work",             file: "part-10-সমাপনী-বক্তব্য.txt" },
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Connected");

  await Introduction.deleteMany({});
  console.log("Cleared old introductions");

  const dir = path.join(__dirname, "../../../intro_parts");

  for (const part of PARTS) {
    const filepath = path.join(dir, part.file);
    const content_bn = fs.existsSync(filepath) ? fs.readFileSync(filepath, "utf-8").trim() : "";
    await Introduction.create({ serial: part.serial, title_bn: part.title_bn, title_en: part.title_en, content_bn, content_en: "" });
    console.log(`✅ Part ${part.serial}: ${content_bn.length} chars`);
  }

  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
