import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Upload, FileText, CheckCircle, XCircle, RefreshCw, Trophy } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  answers: boolean[];
}

const AIQuiz: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'generating' | 'quiz' | 'results'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Sample questions (in real app, these would come from OpenAI API)
  const sampleQuestions: Question[] = [
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const generateQuiz = async () => {
    if (!file && !textInput.trim()) {
      alert('Please upload a file or enter some text to generate a quiz.');
      return;
    }

    setIsGenerating(true);
    setCurrentStep('generating');

    // Simulate API call to OpenAI
    setTimeout(() => {
      setQuestions(sampleQuestions);
      setCurrentStep('quiz');
      setIsGenerating(false);
    }, 3000);

    // In a real application, you would make an API call like this:
    /*
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      } else {
        formData.append('text', textInput);
      }
      
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setQuestions(data.questions);
      setCurrentStep('quiz');
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setIsGenerating(false);
    }
    */
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate results
      const correctAnswers = selectedAnswers.map((answer, index) => 
        answer === questions[index].correct
      );
      const score = correctAnswers.filter(Boolean).length;
      const percentage = Math.round((score / questions.length) * 100);
      
      setQuizResult({
        score,
        total: questions.length,
        percentage,
        answers: correctAnswers
      });
      setCurrentStep('results');
    }
  };

  const restartQuiz = () => {
    setCurrentStep('upload');
    setFile(null);
    setTextInput('');
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setQuizResult(null);
  };

  const retakeQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setQuizResult(null);
    setCurrentStep('quiz');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Quiz Generator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your notes into personalized quizzes powered by AI. Upload your study materials and test your knowledge.
          </p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Upload Step */}
            {currentStep === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="p-8"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
                  Upload Your Study Material
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* File Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <Upload className="h-5 w-5 mr-2" />
                      Upload File
                    </h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        Upload PDF, DOCX, or image files
                      </p>
                      <label className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium cursor-pointer hover:bg-blue-600 transition-colors inline-block">
                        Choose File
                        <input
                          type="file"
                          accept=".pdf,.docx,.jpg,.jpeg,.png,.txt"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      {file && (
                        <p className="mt-4 text-sm text-green-600 font-medium">
                          File selected: {file.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Text Input */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Or Paste Text Directly
                    </h3>
                    <textarea
                      rows={10}
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Paste your notes, textbook chapters, or any study material here..."
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generateQuiz}
                    disabled={!file && !textInput.trim()}
                    className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
                  >
                    Generate AI Quiz
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Generating Step */}
            {currentStep === 'generating' && (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 text-center py-16"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="bg-gradient-to-r from-purple-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Brain className="h-8 w-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Generating Your Quiz...
                </h2>
                <p className="text-gray-600">
                  Our AI is analyzing your material and creating personalized questions. This may take a moment.
                </p>
              </motion.div>
            )}

            {/* Quiz Step */}
            {currentStep === 'quiz' && questions.length > 0 && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="p-8"
              >
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${((currentQuestion + 1) / questions.length) * 100}%`
                      }}
                    />
                  </div>
                </div>

                {/* Question */}
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    {questions[currentQuestion].question}
                  </h2>

                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                          selectedAnswers[currentQuestion] === index
                            ? 'border-blue-500 bg-blue-50 text-blue-900'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-medium mr-3">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Next Button */}
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextQuestion}
                    disabled={selectedAnswers[currentQuestion] === undefined}
                    className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
                  >
                    {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Results Step */}
            {currentStep === 'results' && quizResult && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-8 text-center"
              >
                <div className="mb-8">
                  {quizResult.percentage >= 80 ? (
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="h-10 w-10 text-green-600" />
                    </div>
                  ) : quizResult.percentage >= 60 ? (
                    <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-10 w-10 text-yellow-600" />
                    </div>
                  ) : (
                    <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <XCircle className="h-10 w-10 text-red-600" />
                    </div>
                  )}

                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Quiz Complete!
                  </h2>
                  <p className="text-xl text-gray-600 mb-6">
                    You scored {quizResult.score} out of {quizResult.total} ({quizResult.percentage}%)
                  </p>

                  {/* Performance Message */}
                  <div className={`p-4 rounded-lg mb-6 ${
                    quizResult.percentage >= 80 
                      ? 'bg-green-50 text-green-800' 
                      : quizResult.percentage >= 60 
                      ? 'bg-yellow-50 text-yellow-800' 
                      : 'bg-red-50 text-red-800'
                  }`}>
                    {quizResult.percentage >= 80 && "Excellent work! You have a strong understanding of the material."}
                    {quizResult.percentage >= 60 && quizResult.percentage < 80 && "Good job! Review the topics you missed to improve further."}
                    {quizResult.percentage < 60 && "Keep studying! Focus on understanding the key concepts better."}
                  </div>
                </div>

                {/* Question Review */}
                <div className="mb-8 text-left max-w-2xl mx-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Answers</h3>
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          quizResult.answers[index]
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-start">
                          {quizResult.answers[index] ? (
                            <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900 mb-2">
                              {question.question}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Correct answer:</span> {question.options[question.correct]}
                            </p>
                            {question.explanation && (
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Explanation:</span> {question.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={retakeQuiz}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
                  >
                    <RefreshCw className="h-5 w-5 inline mr-2" />
                    Retake Quiz
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={restartQuiz}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Create New Quiz
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AIQuiz;