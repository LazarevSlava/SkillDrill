// server/scripts/seedSessionTemplates.js
require("dotenv").config();
const mongoose = require("mongoose");
const SessionTemplate = require("../models/SessionTemplate");

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/skilldrill";

const TEMPLATES = [
  {
    slug: "js-easy-15",
    title: "JavaScript — лёгкая, 15 мин",
    description: "Базовые вопросы по JS для разогрева.",
    topics: ["js"],
    durationMin: 15,
    difficulty: "easy",
    position: "Junior",
    isActive: true,
  },
  {
    slug: "react-medium-30",
    title: "React — средняя, 30 мин",
    description: "Компоненты, состояние, хуки, ключевые паттерны.",
    topics: ["react"],
    durationMin: 30,
    difficulty: "medium",
    position: "Middle",
    isActive: true,
  },
  {
    slug: "fullstack-hard-60",
    title: "Full-stack — сложная, 60 мин",
    description: "Глубокие вопросы по JS/Node/HTTP/БД/арх-ре.",
    topics: ["js", "node", "db", "http"],
    durationMin: 60,
    difficulty: "hard",
    position: "Senior",
    isActive: true,
  },
];

async function main() {
  await mongoose.connect(MONGO_URI, { dbName: "skilldrill" });

  for (const t of TEMPLATES) {
    await SessionTemplate.updateOne(
      { slug: t.slug },
      { $set: t },
      { upsert: true },
    );
    console.log(`✓ upsert: ${t.slug}`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
