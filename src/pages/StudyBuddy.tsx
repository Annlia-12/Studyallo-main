import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Clock, MapPin, Plus, Search } from 'lucide-react';

interface StudySession {
  id: string;
  subject: string;
  location: string;
  date: string;
  time: string;
  duration: number;
  author: string;
  description: string;
  participants: number;
  maxParticipants: number;
}

const StudyBuddy: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [studySessions, setStudySessions] = useState<StudySession[]>([
    {
      id: '1',
      subject: 'Data Structures & Algorithms',
      location: 'Data Structures Lab',
      date: '2025-01-20',
      time: '14:00',
      duration: 120,
      author: 'Annlia Jose',
      description: 'Working on stacks, queue and linked lists.',
      participants: 2,
      maxParticipants: 4,
    },
    {
      id: '2',
      subject: 'Mathematics for Information Science',
      location: 'SJCET Library',
      date: '2025-01-21',
      time: '10:00',
      duration: 180,
      author: 'Ann Scaria',
      description: 'Review session for upcoming internals. Focus on Binomial Distribution.',
      participants: 3,
      maxParticipants: 6,
    },
    {
      id: '3',
      subject: 'Object Oriented Programming',
      location: 'Madona Cafeteria',
      date: '2025-01-22',
      time: '16:30',
      duration: 90,
      author: 'Merin Anna Johns',
      description: 'Parameterized Constructors and Inheritance concepts.',
      participants: 1,
      maxParticipants: 3,
    },
  ]);

  const [newSession, setNewSession] = useState({
    subject: '',
    location: '',
    date: '',
    time: '',
    duration: 120,
    description: '',
    maxParticipants: 4,
  });

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const session: StudySession = {
      id: Date.now().toString(),
      ...newSession,
      author: 'You',
      participants: 1,
    };
    setStudySessions([session, ...studySessions]);
    setNewSession({
      subject: '',
      location: '',
      date: '',
      time: '',
      duration: 120,
      description: '',
      maxParticipants: 4,
    });
    setShowCreateForm(false);
  };

  const handleJoinSession = (sessionId: string) => {
    setStudySessions(sessions =>
      sessions.map(session =>
        session.id === sessionId
          ? { ...session, participants: session.participants + 1 }
          : session
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Study Buddy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with fellow students for collaborative learning sessions. Create or join study groups in your area.
          </p>
        </motion.div>

        {/* Create Session Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 text-center"
        >
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold inline-flex items-center space-x-2 hover:shadow-lg transition-shadow"
          >
            <Plus className="h-5 w-5" />
            <span>Create Study Session</span>
          </button>
        </motion.div>

        {/* Create Session Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create New Study Session</h2>
            <form onSubmit={handleCreateSession} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={newSession.subject}
                  onChange={(e) => setNewSession({ ...newSession, subject: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Calculus, Chemistry, Programming"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  required
                  value={newSession.location}
                  onChange={(e) => setNewSession({ ...newSession, location: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Library Room 101, Student Center"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  required
                  value={newSession.date}
                  onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  required
                  value={newSession.time}
                  onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <select
                  value={newSession.duration}
                  onChange={(e) => setNewSession({ ...newSession, duration: Number(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                  <option value={180}>3 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
                <select
                  value={newSession.maxParticipants}
                  onChange={(e) => setNewSession({ ...newSession, maxParticipants: Number(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={2}>2 people</option>
                  <option value={3}>3 people</option>
                  <option value={4}>4 people</option>
                  <option value={5}>5 people</option>
                  <option value={6}>6 people</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={newSession.description}
                  onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What topics will you cover? Any specific goals?"
                />
              </div>

              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
                >
                  Create Session
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Study Sessions List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {studySessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{session.subject}</h3>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm font-medium">
                  {session.participants}/{session.maxParticipants}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">{session.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">{session.date}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">{session.time} • {session.duration} min</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm">Hosted by {session.author}</span>
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-4 line-clamp-2">{session.description}</p>

              <button
                onClick={() => handleJoinSession(session.id)}
                disabled={session.participants >= session.maxParticipants}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  session.participants >= session.maxParticipants
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg'
                }`}
              >
                {session.participants >= session.maxParticipants ? 'Session Full' : 'Join Session'}
              </button>
            </motion.div>
          ))}
        </motion.div>

        {studySessions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No study sessions yet</h3>
            <p className="text-gray-500">Be the first to create a study session!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudyBuddy;