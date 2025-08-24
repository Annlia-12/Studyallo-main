// Install deps (once):
// npm i express cors multer dotenv openai pdf-parse mammoth

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
require("dotenv").config();

const OpenAI = require("openai/index.js");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

// Uploads
const upload = multer({ dest: "uploads/" });

// Health
app.get("/", (req, res) => {
  res.send("Server is running! Use POST /api/generate-questions");
});

async function extractTextFromFile(filePath, originalName) {
  const ext = path.extname(originalName).toLowerCase();
  if (ext === ".txt") {
    return fs.readFileSync(filePath, "utf8");
  }
  if (ext === ".pdf") {
    const data = await pdfParse(fs.readFileSync(filePath));
    return data.text || "";
  }
  if (ext === ".docx") {
    const { value } = await mammoth.extractRawText({ path: filePath });
    return value || "";
  }
  // Images not implemented here to keep it light
  throw new Error("Unsupported file type. Use .txt, .pdf, or .docx");
}

app.post("/api/generate-questions", upload.single("file"), async (req, res) => {
  try {
    let content = "";

    if (req.file) {
      try {
        content = await extractTextFromFile(req.file.path, req.file.originalname);
      } finally {
        // cleanup temp file
        try { fs.unlinkSync(req.file.path); } catch {}
      }
    } else if (req.body.text) {
      content = String(req.body.text);
    } else {
      return res.status(400).json({ error: "No content provided" });
    }

    if (!content.trim()) {
      return res.status(400).json({ error: "Could not read any text from the provided input." });
    }

    // ---- OpenAI: ask for STRICT JSON with 5 MCQs ----
    const messages = [
      {
        role: "system",
        content:
          "You are a quiz generator. Always reply with ONLY valid JSON (no markdown). JSON shape: " +
          '{"questions":[{"question":"string","options":["string","string","string","string"],"correctIndex":0}]} ' +
          "Ensure exactly 4 options per question and a single correctIndex (0-3).",
      },
      {
        role: "user",
        content:
          `Create 5 multiple-choice questions (MCQs) from the study material below. ` +
          `Return ONLY JSON using the schema above.\n\n` +
          `Study Material:\n${content}`,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages,
    });

    let raw = completion.choices?.[0]?.message?.content || "";

    // Try to parse even if the model adds stray text
    const first = raw.indexOf("{");
    const last = raw.lastIndexOf("}");
    if (first !== -1 && last !== -1) raw = raw.slice(first, last + 1);

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error("JSON parse failed. Raw response:", raw);
      return res.status(500).json({ error: "Failed to parse model output as JSON." });
    }

    // Basic validation
    if (
      !parsed ||
      !Array.isArray(parsed.questions) ||
      parsed.questions.some(
        (q) =>
          !q ||
          typeof q.question !== "string" ||
          !Array.isArray(q.options) ||
          q.options.length !== 4 ||
          typeof q.correctIndex !== "number"
      )
    ) {
      return res.status(500).json({ error: "Output JSON did not match expected schema." });
    }

    return res.json(parsed); // { questions: [...] }
  } catch (err) {
    console.error("Error generating questions:", err);
    res.status(500).json({ error: err.message || "Failed to generate questions." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
