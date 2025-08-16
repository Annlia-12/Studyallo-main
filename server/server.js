const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, PDF, DOCX, and TXT files are allowed.'));
    }
  }
});

// In-memory storage for demo purposes (use MongoDB in production)
let studySessions = [
  {
    id: '1',
    subject: 'Data Structures & Algorithms',
    location: 'Central Library - Room 204',
    date: '2025-01-20',
    time: '14:00',
    duration: 120,
    author: 'Sarah Chen',
    description: 'Working on tree traversal algorithms and dynamic programming problems.',
    participants: 2,
    maxParticipants: 4,
  }
];

let exams = [
  {
    id: '1',
    subject: 'Data Structures & Algorithms',
    date: '2025-01-25',
    time: '09:00',
    location: 'Computer Science Building - Room 101',
    duration: 180,
    type: 'Midterm',
    notes: 'Focus on trees, graphs, and dynamic programming',
    daysLeft: 5,
  }
];

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Campus Study Link API is running' });
});

// Study Sessions API
app.get('/api/study-sessions', (req, res) => {
  res.json(studySessions);
});

app.post('/api/study-sessions', (req, res) => {
  const newSession = {
    id: Date.now().toString(),
    ...req.body,
    participants: 1,
    author: 'You'
  };
  studySessions.unshift(newSession);
  res.status(201).json(newSession);
});

app.post('/api/study-sessions/:id/join', (req, res) => {
  const sessionId = req.params.id;
  const session = studySessions.find(s => s.id === sessionId);
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  if (session.participants >= session.maxParticipants) {
    return res.status(400).json({ error: 'Session is full' });
  }
  
  session.participants += 1;
  res.json(session);
});

// Exams API
app.get('/api/exams', (req, res) => {
  res.json(exams);
});

app.post('/api/exams', (req, res) => {
  const calculateDaysLeft = (examDate) => {
    const today = new Date();
    const exam = new Date(examDate);
    const diffTime = exam.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const newExam = {
    id: Date.now().toString(),
    ...req.body,
    daysLeft: calculateDaysLeft(req.body.date)
  };
  
  exams.push(newExam);
  exams.sort((a, b) => new Date(a.date) - new Date(b.date));
  res.status(201).json(newExam);
});

app.delete('/api/exams/:id', (req, res) => {
  const examId = req.params.id;
  const examIndex = exams.findIndex(e => e.id === examId);
  
  if (examIndex === -1) {
    return res.status(404).json({ error: 'Exam not found' });
  }
  
  exams.splice(examIndex, 1);
  res.status(204).send();
});

// File upload for exam schedules
app.post('/api/upload-schedule', upload.single('schedule'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // In a real application, you would process the PDF/image here
  // For demo purposes, we'll just return a success message
  res.json({
    message: 'Schedule uploaded successfully',
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

// AI Quiz Generation API
app.post('/api/generate-quiz', upload.single('file'), async (req, res) => {
  try {
    let content = '';
    
    if (req.file) {
      // In a real application, you would extract text from the uploaded file
      // For demo purposes, we'll use sample content
      content = 'Sample study material about data structures and algorithms';
    } else if (req.body.text) {
      content = req.body.text;
    } else {
      return res.status(400).json({ error: 'No content provided' });
    }

    // In a real application, you would call OpenAI API here
    // For demo purposes, we'll return sample questions
    const sampleQuestions = [
      {
        id: 1,
        question: "What is the time complexity of searching in a balanced binary search tree?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correct: 1,
        explanation: "In a balanced BST, the height is log n, so searching takes O(log n) time."
      },
      {
        id: 2,
        question: "Which sorting algorithm has the best average-case time complexity?",
        options: ["Bubble Sort", "Quick Sort", "Insertion Sort", "Selection Sort"],
        correct: 1,
        explanation: "Quick Sort has an average-case time complexity of O(n log n)."
      },
      {
        id: 3,
        question: "What data structure is used to implement recursion?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correct: 1,
        explanation: "The call stack is used to manage function calls in recursion."
      }
    ];

    /* 
    // Real OpenAI API implementation would look like this:
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an AI that generates multiple choice quiz questions based on study material. Generate 5-10 questions with 4 options each, marking the correct answer and providing explanations.'
          },
          {
            role: 'user',
            content: `Generate quiz questions based on this study material: ${content}`
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    // Parse the AI response and format as questions array
    */

    res.json({
      questions: sampleQuestions,
      message: 'Quiz generated successfully'
    });

  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

// AI Study Buddy API (for answering questions, summaries, motivation)
app.post('/api/ai-study-buddy', async (req, res) => {
  try {
    const { prompt, mode } = req.body;

    if (!prompt || !mode) {
      return res.status(400).json({ error: 'Prompt and mode are required' });
    }

    // Sample responses based on mode (in real app, these would come from OpenAI)
    let response = '';
    
    switch (mode) {
      case 'answer':
        response = `Based on your question about "${prompt}", here's a comprehensive answer: This is a complex topic that requires understanding of fundamental principles. The key concepts involve...`;
        break;
      case 'summarize':
        response = `Here's a summary of your text: The main points are... Key takeaways include...`;
        break;
      case 'motivate':
        response = `You've got this! Remember that every expert was once a beginner. Your dedication to learning shows real commitment to your goals. Keep pushing forward - success is built one study session at a time!`;
        break;
      default:
        return res.status(400).json({ error: 'Invalid mode' });
    }

    /*
    // Real OpenAI API implementation:
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(mode)
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: mode === 'motivate' ? 0.8 : 0.7,
      }),
    });

    const data = await openaiResponse.json();
    response = data.choices[0].message.content;
    */

    res.json({ response });

  } catch (error) {
    console.error('Error with AI study buddy:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Helper function for system prompts (for real OpenAI implementation)
function getSystemPrompt(mode) {
  switch (mode) {
    case 'answer':
      return 'You are a helpful AI tutor. Provide clear, accurate, and educational answers to student questions. Break down complex concepts into understandable parts.';
    case 'summarize':
      return 'You are an AI that creates concise, well-structured summaries of study material. Focus on key points, main ideas, and important details.';
    case 'motivate':
      return 'You are a motivational study coach. Provide encouraging, positive, and inspiring messages to help students stay motivated in their learning journey.';
    default:
      return 'You are a helpful AI assistant for students.';
  }
}

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Campus Study Link API server running on port ${PORT}`);
  console.log(`📚 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;