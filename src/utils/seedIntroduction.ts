import path from "path";
import fs from "fs";
import { Introduction } from "../app/content/models";

// Pages 29-68 split into 5 logical parts based on content sections:
// Part 1 (p29-32): Publisher's note & tafsir writing purpose
// Part 2 (p33-36): Quranic language & Arabic literary tradition
// Part 3 (p37-45): Internal coherence (nazm) of the Quran
// Part 4 (p46-57): Quran's structure, groups, external sources
// Part 5 (p58-68): Guidelines for Quran students & closing remarks

const PARTS: { title_bn: string; title_en: string; pages: [number, number] }[] = [
  { title_bn: "ভূমিকা — প্রথম পর্ব: প্রকাশকের নোট ও তাফসীর রচনার উদ্দেশ্য", title_en: "Introduction — Part 1: Publisher's Note & Purpose of Tafsir", pages: [29, 32] },
  { title_bn: "ভূমিকা — দ্বিতীয় পর্ব: কুরআনের ভাষা ও আরবী সাহিত্য ঐতিহ্য", title_en: "Introduction — Part 2: Quranic Language & Arabic Literary Tradition", pages: [33, 36] },
  { title_bn: "ভূমিকা — তৃতীয় পর্ব: কুরআনের অভ্যন্তরীণ যোগসূত্র (নযম)", title_en: "Introduction — Part 3: Internal Coherence (Nazm) of the Quran", pages: [37, 45] },
  { title_bn: "ভূমিকা — চতুর্থ পর্ব: কুরআনের কাঠামো, গ্রুপ বিভাজন ও বাহ্যিক উৎস", title_en: "Introduction — Part 4: Quran's Structure, Groups & External Sources", pages: [46, 57] },
  { title_bn: "ভূমিকা — পঞ্চম পর্ব: কুরআন শিক্ষার্থীদের জন্য নির্দেশনা ও সমাপনী", title_en: "Introduction — Part 5: Guidelines for Students & Closing Remarks", pages: [58, 68] },
];

export const seedIntroduction = async () => {
  try {
    const rawDir = path.join(__dirname, "../../../../raw_tafseer");

    for (let i = 0; i < PARTS.length; i++) {
      const part = PARTS[i];
      const pages: string[] = [];
      for (let p = part.pages[0]; p <= part.pages[1]; p++) {
        const filename = `page-${String(p).padStart(3, "0")}.txt`;
        const filepath = path.join(rawDir, filename);
        if (fs.existsSync(filepath)) {
          const content = fs.readFileSync(filepath, "utf-8").trim();
          if (content) pages.push(content);
        }
      }
      await Introduction.findOneAndUpdate(
        { serial: i + 1 },
        { serial: i + 1, title_bn: part.title_bn, title_en: part.title_en, content_bn: pages.join("\n\n"), content_en: "" },
        { upsert: true, new: true }
      );
      console.log(`✅ Introduction part ${i + 1} seeded`);
    }
  } catch (error) {
    console.error("❌ Error seeding introduction:", error);
  }
};
