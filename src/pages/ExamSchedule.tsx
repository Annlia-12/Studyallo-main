import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Upload, FileText, AlertCircle, Trash2 } from 'lucide-react';

interface Exam {
  id: string;
  subject: string;
  date: string;
  time: string;
  location: string;
  duration: number;
  type: string;
  notes: string;
  daysLeft: number;
}

const ExamSchedule: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([
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
    },
    {
      id: '2',
      subject: 'Organic Chemistry',
      date: '2025-01-28',
      time: '14:00',
      location: 'Chemistry Building - Lab 205',
      duration: 120,
      type: 'Final',
      notes: 'Reaction mechanisms and synthesis problems',
      daysLeft: 8,
    },
    {
      id: '3',
      subject: 'Calculus II',
      date: '2025-02-02',
      time: '10:30',
      location: 'Mathematics Building - Room 301',
      duration: 150,
      type: 'Midterm',
      notes: 'Integration techniques and series',
      daysLeft: 13,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newExam, setNewExam] = useState({
    subject: '',
    date: '',
    time: '',
    location: '',
    duration: 120,
    type: 'Midterm',
    notes: '',
  });

  const calculateDaysLeft = (examDate: string) => {
    const today = new Date();
    const exam = new Date(examDate);
    const diffTime = exam.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    const exam: Exam = {
      id: Date.now().toString(),
      ...newExam,
      daysLeft: calculateDaysLeft(newExam.date),
    };
    setExams([...exams, exam].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setNewExam({
      subject: '',
      date: '',
      time: '',
      location: '',
      duration: 120,
      type: 'Midterm',
      notes: '',
    });
    setShowAddForm(false);
  };

  const handleDeleteExam = (examId: string) => {
    setExams(exams.filter(exam => exam.id !== examId));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real application, you would process the PDF/image here
      // For demo purposes, we'll just show a success message
      alert('Schedule uploaded successfully! (This is a demo - file processing would happen on the server)');
    }
  };

  const getUrgencyColor = (daysLeft: number) => {
    if (daysLeft <= 3) return 'bg-red-100 text-red-800 border-red-200';
    if (daysLeft <= 7) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Exam Schedule</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Keep track of your upcoming exams and never miss an important date. Upload your schedule or add exams manually.
          </p>
        </motion.div>

        {/* Upload & Add Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Upload Schedule */}
            <div className="text-center">
              <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Schedule</h3>
              <p className="text-gray-600 mb-4">Upload your exam schedule as PDF or image</p>
              <label className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer hover:shadow-lg transition-shadow inline-block">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                Choose File
              </label>
            </div>

            {/* Add Manually */}
            <div className="text-center">
              <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Add Manually</h3>
              <p className="text-gray-600 mb-4">Add exam details one by one</p>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
              >
                Add Exam
              </button>
            </div>
          </div>
        </motion.div>

        {/* Add Exam Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add New Exam</h2>
            <form onSubmit={handleAddExam} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={newExam.subject}
                  onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Calculus, Chemistry, Programming"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
                <select
                  value={newExam.type}
                  onChange={(e) => setNewExam({ ...newExam, type: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Midterm">Midterm</option>
                  <option value="Final">Final</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Project">Project</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  required
                  value={newExam.date}
                  onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  required
                  value={newExam.time}
                  onChange={(e) => setNewExam({ ...newExam, time: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <select
                  value={newExam.duration}
                  onChange={(e) => setNewExam({ ...newExam, duration: Number(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                  <option value={180}>3 hours</option>
                  <option value={240}>4 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  required
                  value={newExam.location}
                  onChange={(e) => setNewExam({ ...newExam, location: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Building Name - Room Number"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  rows={3}
                  value={newExam.notes}
                  onChange={(e) => setNewExam({ ...newExam, notes: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Important topics, materials to bring, etc."
                />
              </div>

              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
                >
                  Add Exam
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Exams List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900">Upcoming Exams</h2>

          {exams.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No exams scheduled</h3>
              <p className="text-gray-500">Add your first exam to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {exams.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{exam.subject}</h3>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm font-medium">
                        {exam.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getUrgencyColor(exam.daysLeft)}`}>
                        {exam.daysLeft === 0 ? 'Today!' : 
                         exam.daysLeft === 1 ? 'Tomorrow' : 
                         exam.daysLeft < 0 ? 'Passed' : 
                         `${exam.daysLeft} days`}
                      </div>
                      <button
                        onClick={() => handleDeleteExam(exam.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">{new Date(exam.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">{exam.time} • {exam.duration} minutes</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">{exam.location}</span>
                    </div>
                  </div>

                  {exam.notes && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">{exam.notes}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ExamSchedule;