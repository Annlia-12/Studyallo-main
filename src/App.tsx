import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import StudyBuddy from './pages/StudyBuddy';
import Timer from './pages/Timer';
import ExamSchedule from './pages/ExamSchedule';
import AIQuiz from './pages/AIQuiz';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './context/AuthContext';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/study-buddy" element={<StudyBuddy />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="/exam-schedule" element={<ExamSchedule />} />
            <Route path="/ai-quiz" element={<AIQuiz />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
