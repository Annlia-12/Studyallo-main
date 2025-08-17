const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai'); // <-- OpenAI import

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

// Middleware
app.use(cors());
app.use(express.json());

// Multer file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// In-memory data
let studySessions = [
  { id: '1', subject: 'Data Structures & Algorithms', location: 'Central Library - Room 204', date: '2025-01-20', time: '14:00', duration: 120, author: 'Sarah Chen', description: 'Working on tree traversal algorithms and dynamic programming problems.', participants: 2, maxParticipants: 4 }
];
let exams = [
  { id: '1', subject: 'Data Structures & Algorithms', date: '2025-01-25', time: '09:00', location: 'Computer Science Building - Room 101', duration: 180, type: 'Midterm', notes: 'Focus on trees, graphs, and dynamic programming', daysLeft: 5 }
];

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Campus Study Link API is running' }));

// Study sessions
app.get('/api/study-sessions', (req, res) => res.json(studySessions));
app.post('/api/study-sessions', (req, res) => {
  const newSession = { id: Date.now().toString(), ...req.body, participants: 1, author: 'You' };
  studySessions.unshift(newSession);
  res.status(201).json(newSession);
});
app.post('/api/study-sessions/:id/join', (req, res) => {
  const session = studySessions.find(s => s.id === req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (session.participants >= session.maxParticipants) return res.status(400).json({ error: 'Session is full' });
  session.participants += 1;
  res.json(session);
});

// Exams
app.get('/api/exams', (req, res) => res.json(exams));
app.post('/api/exams', (req, res) => {
  const daysLeft = Math.ceil((new Date(req.body.date) - new Date()) / (1000 * 60 * 60 * 24));
  const newExam = { id: Date.now().toString(), ...req.body, daysLeft };
  exams.push(newExam);
  exams.sort((a, b) => new Date(a.date) - new Date(b.date));
  res.status(201).json(newExam);
});
app.delete('/api/exams/:id', (req, res) => {
  const index = exams.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Exam not found' });
  exams.splice(index, 1);
  res.status(204).send();
});

// File upload
app.post('/api/upload-schedule', upload.single('schedule'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ message: 'Schedule uploaded successfully', filename: req.file.filename, originalName: req.file.originalname, size: req.file.size });
});

// AI Quiz generator (OpenAI)
app.post('/api/generate-quiz', upload.single('file'), async (req, res) => {
  try {
    let content = req.file ? 'Extracted text from uploaded file goes here' : req.body.text || '';
    if (!content) return res.status(400).json({ error: 'No content provided' });

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an AI that generates multiple choice quiz questions.' },
        { role: 'user', content: `Create 5-10 multiple choice questions with 4 options each, indicate correct answer and explanation, based on: ${content}` }
      ],
      temperature: 0.7
    });

    const aiText = response.data.choices[0].message.content;
    res.json({ questions: aiText, message: 'Quiz generated successfully' });

  } catch (error) {
    console.error('AI Quiz error:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

// AI Study Buddy (OpenAI)
app.post('/api/ai-study-buddy', async (req, res) => {
  try {
    const { prompt, mode } = req.body;
    if (!prompt || !mode) return res.status(400).json({ error: 'Prompt and mode required' });

    const systemPrompts = {
      answer: 'You are a helpful AI tutor. Answer student questions in detail.',
      summarize: 'You are an AI that creates concise, clear summaries.',
      motivate: 'You are a motivational study coach. Encourage and inspire students.'
    };

    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompts[mode] || systemPrompts.answer },
        { role: 'user', content: prompt }
      ],
      temperature: mode === 'motivate' ? 0.8 : 0.7
    });

    res.json({ response: response.data.choices[0].message.content });

  } catch (error) {
    console.error('AI Study Buddy error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File too large (max 10MB)' });
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} | Health check: http://localhost:${PORT}/api/health`));

module.exports = app;
