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

// Fallback sample questions
const sampleQuestions: Question[] = [
  { id: 1, question: "What is the time complexity of searching in a balanced BST?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correct: 1, explanation: "Searching takes O(log n) in a balanced BST." },
  { id: 2, question: "Which sorting algorithm has the best average-case time?", options: ["Bubble", "Quick", "Insertion", "Selection"], correct: 1, explanation: "Quick Sort has O(n log n) average-case." },
  { id: 3, question: "What data structure implements recursion?", options: ["Queue", "Stack", "Array", "Linked List"], correct: 1, explanation: "Call stack manages function calls." }
];

const AIQuiz: React.FC = () => {
  const [step, setStep] = useState<'upload'|'generating'|'quiz'|'results'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.files?.[0] && setFile(e.target.files[0]);
  };

  const generateQuiz = async () => {
    if (!file && !text.trim()) return alert('Upload a file or enter text.');
    setLoading(true);
    setStep('generating');
    setError('');

    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      if (text.trim()) formData.append('text', text.trim());

      const res = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/generate-quiz`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error(`Server error: ${res.statusText}`);
      const data = await res.json();

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        // fallback to sample questions
        setQuestions(sampleQuestions);
      }

      setStep('quiz');
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate quiz. Showing sample questions.');
      setQuestions(sampleQuestions);
      setStep('quiz');
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (i: number) => {
    const a = [...answers];
    a[current] = i;
    setAnswers(a);
  };

  const next = () => {
    if (current < questions.length - 1) setCurrent(current + 1);
    else {
      const corrects = answers.map((a, i) => a === questions[i].correct);
      const score = corrects.filter(Boolean).length;
      setResult({
        score,
        total: questions.length,
        percentage: Math.round((score / questions.length) * 100),
        answers: corrects
      });
      setStep('results');
    }
  };

  const restart = () => {
    setStep('upload');
    setFile(null);
    setText('');
    setQuestions([]);
    setCurrent(0);
    setAnswers([]);
    setResult(null);
    setError('');
  };

  const retake = () => {
    setCurrent(0);
    setAnswers([]);
    setResult(null);
    setStep('quiz');
  };

  const progress = questions.length ? Math.round(((current + 1) / questions.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.6}} className="text-center mb-12">
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Quiz Generator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Transform your notes into personalized quizzes powered by AI.</p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <AnimatePresence mode="wait">
            {step==='upload' && (
              <motion.div key="upload" initial={{opacity:0,x:50}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-50}} className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Upload Your Study Material</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <Upload className="h-5 w-5 mr-2"/>Upload File
                    </h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
                      <p className="text-gray-600 mb-4">Upload PDF, DOCX, or image files</p>
                      <label className="bg-blue-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-600">
                        Choose File <input type="file" accept=".pdf,.docx,.jpg,.jpeg,.png,.txt" onChange={handleFile} className="hidden"/>
                      </label>
                      {file && <p className="mt-4 text-sm text-green-600 font-medium">File selected: {file.name}</p>}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Or Paste Text</h3>
                    <textarea rows={10} value={text} onChange={e=>setText(e.target.value)} placeholder="Paste your notes..." className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"/>
                  </div>
                </div>
                {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
                <div className="mt-8 text-center">
                  <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={generateQuiz} disabled={!file && !text.trim()} className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow">Generate AI Quiz</motion.button>
                </div>
              </motion.div>
            )}

            {step==='generating' && (
              <motion.div key="generating" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="p-8 text-center py-16">
                <motion.div animate={{rotate:360}} transition={{duration:2,repeat:Infinity,ease:"linear"}} className="bg-gradient-to-r from-purple-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-8 w-8 text-white"/>
                </motion.div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Generating Your Quiz...</h2>
                <p className="text-gray-600">AI is analyzing your material. Please wait.</p>
              </motion.div>
            )}

            {step==='quiz' && questions.length>0 && (
              <motion.div key="quiz" initial={{opacity:0,x:50}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-50}} className="p-8">
                <div className="mb-8">
                  <div className="flex justify-between mb-2"><span className="text-sm font-medium text-gray-600">Question {current+1} of {questions.length}</span><span className="text-sm font-medium text-gray-600">{progress}%</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-300" style={{width:`${progress}%`}}/>
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">{questions[current].question}</h2>
                <div className="space-y-3">
                  {questions[current].options.map((o,i)=>
                    <motion.button key={i} whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={()=>selectAnswer(i)} className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${answers[current]===i?'border-blue-500 bg-blue-50 text-blue-900':'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                      <span className="font-medium mr-3">{String.fromCharCode(65+i)}.</span>{o}
                    </motion.button>
                  )}
                </div>
                <div className="text-center mt-6">
                  <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={next} disabled={answers[current]===undefined} className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow">{current===questions.length-1?'Finish Quiz':'Next Question'}</motion.button>
                </div>
              </motion.div>
            )}

            {step==='results' && result && (
              <motion.div key="results" initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.9}} className="p-8 text-center">
                <div className="mb-8">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${result.percentage>=80?'bg-green-100':result.percentage>=60?'bg-yellow-100':'bg-red-100'}`}>
                    {result.percentage>=80?<Trophy className="h-10 w-10 text-green-600"/>:result.percentage>=60?<CheckCircle className="h-10 w-10 text-yellow-600"/>:<XCircle className="h-10 w-10 text-red-600"/>}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
                  <p className="text-xl text-gray-600 mb-6">You scored {result.score} out of {result.total} ({result.percentage}%)</p>
                  <div className={`p-4 rounded-lg mb-6 ${result.percentage>=80?'bg-green-50 text-green-800':result.percentage>=60?'bg-yellow-50 text-yellow-800':'bg-red-50 text-red-800'}`}>
                    {result.percentage>=80?"Excellent work!":result.percentage>=60?"Good job!": "Keep studying!"}
                  </div>
                </div>
                <div className="mb-8 text-left max-w-2xl mx-auto space-y-4">
                  {questions.map((q,i)=>
                    <div key={i} className={`p-4 rounded-lg border ${result.answers[i]?'border-green-200 bg-green-50':'border-red-200 bg-red-50'}`}>
                      <div className="flex items-start">
                        {result.answers[i]?<CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0"/>:<XCircle className="h-5 w-5 text-red-600 mt-1 mr-3 flex-shrink-0"/>}
                        <div>
                          <p className="font-medium text-gray-900 mb-2">{q.question}</p>
                          <p className="text-sm text-gray-600"><span className="font-medium">Correct:</span> {q.options[q.correct]}</p>
                          {q.explanation && <p className="text-sm text-gray-600 mt-1"><span className="font-medium">Explanation:</span> {q.explanation}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={retake} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"><RefreshCw className="h-5 w-5 inline mr-2"/>Retake Quiz</motion.button>
                  <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={restart} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">Create New Quiz</motion.button>
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
