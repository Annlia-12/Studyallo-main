import React, { useMemo, useState } from "react";

type MCQ = {
  question: string;
  options: string[]; // length 4
  correctIndex: number; // 0..3
};

const AIQuiz: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // Quiz state
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [step, setStep] = useState<"input" | "quiz" | "result">("input");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]); // -1 = not answered
  const [score, setScore] = useState(0);

  const canGenerate = useMemo(
    () => (!!file || text.trim().length > 0) && !loading,
    [file, text, loading]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const resetQuiz = () => {
    setQuestions([]);
    setAnswers([]);
    setIdx(0);
    setScore(0);
    setStep("input");
  };

  const startQuizFromData = (qs: MCQ[]) => {
    setQuestions(qs);
    setAnswers(Array(qs.length).fill(-1));
    setIdx(0);
    setScore(0);
    setStep("quiz");
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLoading(true);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (text.trim()) formData.append("text", text);

      const res = await fetch("http://localhost:5000/api/generate-questions", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate questions");
      }

      // Expecting { questions: MCQ[] }
      if (!data?.questions || !Array.isArray(data.questions)) {
        throw new Error("Server returned unexpected format.");
      }

      startQuizFromData(data.questions);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error generating questions.");
    } finally {
      setLoading(false);
    }
  };

  const selectOption = (optionIndex: number) => {
    const next = [...answers];
    next[idx] = optionIndex;
    setAnswers(next);
  };

  const goNext = () => setIdx((i) => Math.min(i + 1, questions.length - 1));
  const goPrev = () => setIdx((i) => Math.max(i - 1, 0));

  const submitQuiz = () => {
    const sc = answers.reduce((sum, ans, i) => {
      if (ans === questions[i].correctIndex) return sum + 1;
      return sum;
    }, 0);
    setScore(sc);
    setStep("result");
  };

  // UI helpers
  const current = questions[idx];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5eaff] via-[#eef4ff] to-[#f9fbff]">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-4">
            <span className="text-2xl">🧠</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800">AI Quiz Generator</h1>
          <p className="text-gray-600 mt-2">
            Transform your notes into personalized MCQ quizzes powered by AI.
          </p>
        </div>

        {step === "input" && (
          <div className="mx-auto max-w-3xl bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-center mb-6">
              Upload Your Study Material
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upload box */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                <div className="text-5xl mb-4">📄</div>
                <p className="text-gray-500 mb-4">Upload PDF, DOCX, or image files</p>
                <label className="inline-block">
                  <input
                    type="file"
                    accept=".txt,.pdf,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <span className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer">
                    Choose File
                  </span>
                </label>
                {file && (
                  <p className="text-sm text-gray-600 mt-3 truncate max-w-[220px]">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              {/* Textarea */}
              <div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your notes, textbook chapters, or any study material here..."
                  className="w-full h-48 p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                disabled={!canGenerate}
                onClick={handleGenerate}
                className={`px-6 py-3 rounded-xl text-white shadow-md transition
                ${canGenerate ? "bg-gradient-to-r from-purple-600 to-indigo-500 hover:opacity-90"
                               : "bg-gray-300 cursor-not-allowed"}`}
              >
                {loading ? "Generating..." : "Generate AI Quiz"}
              </button>
            </div>
          </div>
        )}

        {step === "quiz" && current && (
          <div className="mx-auto max-w-3xl bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Question {idx + 1} of {questions.length}
              </h2>
              <button
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={resetQuiz}
              >
                ← Start over
              </button>
            </div>

            <p className="text-lg font-medium text-gray-800 mb-6">{current.question}</p>

            <div className="space-y-3">
              {current.options.map((opt, i) => {
                const selected = answers[idx] === i;
                return (
                  <button
                    key={i}
                    onClick={() => selectOption(i)}
                    className={`w-full text-left p-3 rounded-xl border transition
                    ${selected ? "border-purple-500 bg-purple-50"
                               : "border-gray-200 hover:bg-gray-50"}`}
                  >
                    <span className="font-semibold mr-2">{String.fromCharCode(65 + i)})</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-8">
              <button
                onClick={goPrev}
                disabled={idx === 0}
                className={`px-4 py-2 rounded-lg border
                ${idx === 0 ? "text-gray-400 border-gray-200 cursor-not-allowed"
                             : "text-gray-700 border-gray-300 hover:bg-gray-50"}`}
              >
                Back
              </button>

              {idx < questions.length - 1 ? (
                <button
                  onClick={goNext}
                  disabled={answers[idx] === -1}
                  className={`px-5 py-2 rounded-lg text-white transition
                  ${answers[idx] === -1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"}`}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={submitQuiz}
                  disabled={answers[idx] === -1}
                  className={`px-5 py-2 rounded-lg text-white transition
                  ${answers[idx] === -1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"}`}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        )}

        {step === "result" && (
          <div className="mx-auto max-w-3xl bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Quiz Completed 🎉</h2>
            <p className="text-lg text-gray-700 mb-6">
              You scored <span className="font-bold">{score}</span> out of{" "}
              {questions.length}
            </p>

            {/* Review */}
            <div className="text-left space-y-6">
              {questions.map((q, i) => {
                const user = answers[i];
                const correct = q.correctIndex;
                const isRight = user === correct;
                return (
                  <div key={i} className="p-4 rounded-xl border border-gray-200">
                    <p className="font-semibold mb-2">
                      {i + 1}. {q.question}
                    </p>
                    <ul className="ml-1 space-y-1">
                      {q.options.map((opt, j) => (
                        <li key={j}>
                          <span className="font-semibold mr-1">{String.fromCharCode(65 + j)})</span>
                          <span
                            className={
                              j === correct
                                ? "text-green-700"
                                : j === user && !isRight
                                ? "text-red-700"
                                : "text-gray-700"
                            }
                          >
                            {opt}
                          </span>
                          {j === correct && <span className="ml-2 text-green-700">✓</span>}
                          {j === user && j !== correct && (
                            <span className="ml-2 text-red-700">✗</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <button
                onClick={resetQuiz}
                className="px-6 py-3 rounded-xl text-white bg-purple-600 hover:bg-purple-700"
              >
                Create Another Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIQuiz;
