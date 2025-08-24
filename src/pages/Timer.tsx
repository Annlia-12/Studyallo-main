import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Settings, AlertTriangle, Coffee } from "lucide-react";

const Timer: React.FC = () => {
  const [studyMinutes, setStudyMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(studyMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDistraction, setShowDistraction] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Visibility (distraction alert)
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && isActive) {
        setShowDistraction(true);
        if ("Notification" in window && Notification.permission === "granted")
          new Notification("Focus! Exams are coming soon!", {
            body: "Get back to studying and achieve your goals!",
            icon: "/vite.svg",
          });
      } else setShowDistraction(false);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [isActive]);

  // Request notification permission once
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default")
      Notification.requestPermission();
  }, []);

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsBreak((b) => !b);
      setTimeLeft((isBreak ? studyMinutes : breakMinutes) * 60);
      if ("Notification" in window && Notification.permission === "granted")
        new Notification(isBreak ? "Break time!" : "Time to study!", {
          body: isBreak ? "Take a break!" : "Back to work! You got this!",
          icon: "/vite.svg",
        });
    }
    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }, [isActive, timeLeft, isBreak, studyMinutes, breakMinutes]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setTimeLeft((isBreak ? breakMinutes : studyMinutes) * 60);
  };
  const format = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const duration = (isBreak ? breakMinutes : studyMinutes) * 60;
  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-purple-100 to-purple-200 relative overflow-hidden py-8">

      {/* Distraction Alert */}
      {showDistraction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          
          
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-8 text-center max-w-md"
          >
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Focus!</h2>
            <p className="text-gray-600 mb-6">Exams are coming soon. Stay on track!</p>
            <button
              onClick={() => setShowDistraction(false)}
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-lg"
            >
              Back to Studying
            </button>
          </motion.div>
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Focus Timer</h1>
          <p className="text-xl text-gray-600">Stay productive with Pomodoro sessions.</p>
        </motion.div>
          

        {/* Timer */}
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center mb-8">
          <div className={`inline-flex items-center px-4 py-2 rounded-full mb-4 ${
            isBreak ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
          }`}>
            {isBreak && <Coffee className="h-4 w-4 mr-2" />}
            {isBreak ? "Break Time" : "Study Time"}
          </div>

          {/* Progress Circle */}
          <div className="relative mb-8">
            <svg className="w-64 h-64 mx-auto transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" strokeWidth="8" className="text-gray-200" fill="none" stroke="currentColor"/>
              <motion.circle
                cx="50" cy="50" r="45" strokeWidth="8" fill="none" strokeLinecap="round"
                className={isBreak ? "text-green-500" : "text-blue-500"}
                stroke="currentColor"
                strokeDasharray={2 * Math.PI * 45}
                strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-5xl font-bold">
              {format(timeLeft)}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            <motion.button whileTap={{ scale: 0.95 }} onClick={toggle}
              className={`px-8 py-4 rounded-full font-semibold flex items-center space-x-2 ${
                isActive ? "bg-red-500 text-white" : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              }`}
            >
              {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              <span>{isActive ? "Pause" : "Start"}</span>
            </motion.button>
            <button onClick={reset} className="px-6 py-4 bg-gray-200 rounded-full">
              <RotateCcw className="h-6 w-6" />
            </button>
            <button onClick={() => setShowSettings(!showSettings)} className="px-6 py-4 bg-gray-200 rounded-full">
              <Settings className="h-6 w-6" />
            </button>
          </div>

          {/* Settings */}
          {showSettings && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              className="bg-gray-50 rounded-xl p-6 mx-auto max-w-md">
              <h3 className="text-lg font-semibold mb-4">Timer Settings</h3>
              {[
                { label: "Study Duration (minutes)", value: studyMinutes, setter: setStudyMinutes, max: 60 },
                { label: "Break Duration (minutes)", value: breakMinutes, setter: setBreakMinutes, max: 30 },
              ].map(({ label, value, setter, max }, i) => (
                <div key={i} className="mb-4">
                  <label className="block text-sm font-medium mb-2">{label}</label>
                  <input type="number" min="1" max={max} value={value}
                    onChange={(e) => setter(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"/>
                </div>
              ))}
              <button onClick={() => { reset(); setShowSettings(false); }}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                Apply Settings
              </button>
            </motion.div>
          )}
        </div>

        {/* Tips */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Focus", desc: "Eliminate distractions and concentrate." },
            { title: "Break", desc: "Take short breaks to recharge." },
            { title: "Repeat", desc: "Build strong study habits." },
          ].map((tip, i) => (
            <div key={i} className="bg-white/70 rounded-xl p-6 text-center shadow">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center mx-auto mb-4 text-white font-bold">
                {i + 1}
              </div>
              <h3 className="text-lg font-semibold mb-2">{tip.title}</h3>
              <p className="text-gray-600 text-sm">{tip.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Timer;

