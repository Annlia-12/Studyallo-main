import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, AlertTriangle, Coffee } from 'lucide-react';

const Timer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [studyMinutes, setStudyMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const [isTabActive, setIsTabActive] = useState(true);
  const [showDistraction, setShowDistraction] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor tab visibility for distraction alerts
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isActive) {
        setIsTabActive(false);
        setShowDistraction(true);
        // Show notification if possible
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Focus! Exams are coming soon!', {
            body: 'Get back to studying and achieve your goals!',
            icon: '/vite.svg'
          });
        }
      } else {
        setIsTabActive(true);
        setShowDistraction(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      setIsActive(false);
      setIsBreak(!isBreak);
      setTimeLeft(isBreak ? studyMinutes * 60 : breakMinutes * 60);
      
      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(
          isBreak ? 'Break time!' : 'Time to study!',
          {
            body: isBreak ? 'Take a well-deserved break!' : 'Back to work! You got this!',
            icon: '/vite.svg'
          }
        );
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, isBreak, studyMinutes, breakMinutes]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft((isBreak ? breakMinutes : studyMinutes) * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((isBreak ? breakMinutes : studyMinutes) * 60 - timeLeft) / ((isBreak ? breakMinutes : studyMinutes) * 60) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      {/* Distraction Alert Modal */}
      {showDistraction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 text-center max-w-md mx-4"
          >
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Focus!</h2>
            <p className="text-gray-600 mb-6">Exams are coming soon. Stay focused on your goals!</p>
            <button
              onClick={() => setShowDistraction(false)}
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Back to Studying
            </button>
          </motion.div>
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Focus Timer</h1>
          <p className="text-xl text-gray-600">
            Stay productive with the Pomodoro technique. Work in focused intervals with short breaks.
          </p>
        </motion.div>

        {/* Timer Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center mb-8">
          <div className="mb-8">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4 ${
              isBreak 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {isBreak ? <Coffee className="h-4 w-4 mr-2" /> : null}
              {isBreak ? 'Break Time' : 'Study Time'}
            </div>
          </div>

          {/* Circular Progress */}
          <div className="relative mb-8">
            <div className="w-64 h-64 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className={isBreak ? 'text-green-500' : 'text-blue-500'}
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  transition={{ duration: 1 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold text-gray-900">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTimer}
              className={`px-8 py-4 rounded-full font-semibold text-lg flex items-center space-x-2 ${
                isActive
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
              }`}
            >
              {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              <span>{isActive ? 'Pause' : 'Start'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetTimer}
              className="px-6 py-4 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-colors"
            >
              <RotateCcw className="h-6 w-6" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(!showSettings)}
              className="px-6 py-4 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-colors"
            >
              <Settings className="h-6 w-6" />
            </motion.button>
          </div>

          {/* Settings */}
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 rounded-xl p-6 mx-auto max-w-md"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timer Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Study Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={studyMinutes}
                    onChange={(e) => setStudyMinutes(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Break Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={breakMinutes}
                    onChange={(e) => setBreakMinutes(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => {
                    resetTimer();
                    setShowSettings(false);
                  }}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Apply Settings
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Study Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Focus</h3>
            <p className="text-gray-600 text-sm">Eliminate distractions and focus solely on your study material.</p>
          </div>

          <div className="bg-green-50 rounded-xl p-6 text-center">
            <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">2</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Break</h3>
            <p className="text-gray-600 text-sm">Take short breaks to recharge and maintain productivity.</p>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 text-center">
            <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Repeat</h3>
            <p className="text-gray-600 text-sm">Continue the cycle to build strong study habits.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Timer;