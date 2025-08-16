# Campus Study Link

A comprehensive educational platform that connects students for collaborative learning, featuring AI-powered tools for enhanced studying experience.

## Features

### 🏠 Landing Page
- Beautiful Pinterest-style rotating background images
- Inspiring quotes from tech leaders and successful figures
- Smooth animations and modern design
- Responsive layout for all devices

### 👥 Study Buddy Finder
- Create and join study sessions
- Match with like-minded students
- Schedule collaborative learning sessions
- Location-based meetups

### ⏰ Focus Timer
- Pomodoro technique implementation
- Distraction alerts when switching tabs
- Progress tracking with visual indicators
- Customizable study and break durations

### 📅 Exam Schedule Manager
- Upload PDF/image schedules
- Manual exam entry with details
- Countdown timers for upcoming exams
- Smart reminders and notifications

### 🧠 AI Quiz Generator
- Upload study materials (PDF, DOCX, images)
- AI-powered question generation using OpenAI
- Multiple choice quizzes with explanations
- Performance tracking and review

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **Multer** for file uploads
- **CORS** for cross-origin requests
- **OpenAI API** integration
- **MongoDB** ready (currently using in-memory storage)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd campus-study-link
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

5. **Start the development servers**
   
   Backend server:
   ```bash
   cd server
   npm run dev
   ```
   
   Frontend server (in a new terminal):
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Endpoints

### Study Sessions
- `GET /api/study-sessions` - Get all study sessions
- `POST /api/study-sessions` - Create new study session
- `POST /api/study-sessions/:id/join` - Join a study session

### Exams
- `GET /api/exams` - Get all exams
- `POST /api/exams` - Add new exam
- `DELETE /api/exams/:id` - Delete exam

### File Upload
- `POST /api/upload-schedule` - Upload exam schedule

### AI Features
- `POST /api/generate-quiz` - Generate AI quiz from materials
- `POST /api/ai-study-buddy` - AI-powered study assistance

## File Structure

```
campus-study-link/
├── src/
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── StudyBuddy.tsx
│   │   ├── Timer.tsx
│   │   ├── ExamSchedule.tsx
│   │   └── AIQuiz.tsx
│   └── App.tsx
├── server/
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## Features in Detail

### Landing Page Animations
- Automatic image rotation every 5 seconds with fade transitions
- Quote carousel with tech leaders and motivational quotes
- Smooth scroll animations and hover effects
- Mobile-responsive design

### Study Buddy Matching
- Create detailed study session posts
- Browse available sessions by subject, location, time
- Instant matching and session confirmation
- Automatic timer setting for confirmed sessions

### Distraction-Free Timer
- Visual progress indicators with circular progress bars
- Tab switching detection with guilt-trip notifications
- Browser notification support
- Customizable study/break intervals

### AI-Powered Features
- Quiz generation from uploaded study materials
- Question answering and text summarization
- Motivational study coaching
- Performance analytics and improvement suggestions

## Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting platform

### Backend Deployment (Render/Railway/Heroku)
1. Set environment variables in your hosting platform
2. Deploy the `server` folder
3. Update frontend API URLs to point to your deployed backend

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Environment Variables

Make sure to set up the following environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key for AI features
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string (for production)
- `JWT_SECRET`: JWT secret for authentication
- `CORS_ORIGIN`: Frontend URL for CORS

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@campusstudylink.com or join our community Discord server.

---

**Campus Study Link** - Making studying collaborative, engaging, and effective! 🎓✨