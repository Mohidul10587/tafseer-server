/**
 * Migration: Merge multiple Introduction parts into a single document.
 *
 * Old schema: array of { serial, title_bn, title_en, content_bn, content_en }
 * New schema: single document { content_bn, content_en }
 *
 * Strategy: concatenate all part content in serial order, separated by a divider.
 * Run once on server startup if more than one Introduction document exists.
 */

import mongoose from "mongoose";

export async function migrateIntroductionToSingleton(): Promise<void> {
  const collection = mongoose.connection.collection("introductions");
  const count = await collection.countDocuments();

  if (count <= 1) return; // already migrated or empty

  console.log(`[migration] Found ${count} introduction parts — merging into singleton…`);

  const parts = await collection.find({}).sort({ serial: 1 }).toArray();

  // Concatenate content, separated by an <hr> divider
  const content_bn = parts
    .map((p) => p.content_bn ?? "")
    .filter(Boolean)
    .join("\n<hr />\n");

  const content_en = parts
    .map((p) => p.content_en ?? "")
    .filter(Boolean)
    .join("\n<hr />\n");

  // Delete all existing documents and insert one clean singleton
  await collection.deleteMany({});
  await collection.insertOne({ content_bn, content_en, createdAt: new Date(), updatedAt: new Date() });

  console.log("[migration] Introduction merged into singleton successfully.");
}
