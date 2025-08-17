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
    { id: '1', subject: 'Data Structures & Algorithms', date: '2025-01-25', time: '09:00', location: 'CS Building - 101', duration: 180, type: 'Midterm', notes: 'Focus on trees, graphs, DP', daysLeft: 5 },
    { id: '2', subject: 'Organic Chemistry', date: '2025-01-28', time: '14:00', location: 'Chemistry Lab 205', duration: 120, type: 'Final', notes: 'Reaction mechanisms', daysLeft: 8 },
    { id: '3', subject: 'Calculus II', date: '2025-02-02', time: '10:30', location: 'Math Building - 301', duration: 150, type: 'Midterm', notes: 'Integration & series', daysLeft: 13 },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newExam, setNewExam] = useState({ subject: '', date: '', time: '', location: '', duration: 120, type: 'Midterm', notes: '' });

  const calcDays = (date: string) => Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const addExam = (e: React.FormEvent) => {
    e.preventDefault();
    setExams([...exams, { id: Date.now().toString(), ...newExam, daysLeft: calcDays(newExam.date) }]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setNewExam({ subject: '', date: '', time: '', location: '', duration: 120, type: 'Midterm', notes: '' });
    setShowForm(false);
  };

  const deleteExam = (id: string) => setExams(exams.filter(exam => exam.id !== id));

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => e.target.files?.[0] && alert('Schedule uploaded successfully!');

  const urgencyClass = (days: number) =>
    days <= 3 ? 'bg-red-100 text-red-800 border-red-200' :
    days <= 7 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
    'bg-green-100 text-green-800 border-green-200';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Exam Schedule</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track upcoming exams and never miss a date. Upload or add manually.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg p-8 mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"><Upload className="h-8 w-8 text-blue-600" /></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Schedule</h3>
            <p className="text-gray-600 mb-4">Upload your exam schedule as PDF or image</p>
            <label className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg cursor-pointer">
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={uploadFile} className="hidden" />
              Choose File
            </label>
          </div>
          <div className="text-center">
            <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"><Calendar className="h-8 w-8 text-green-600" /></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Add Manually</h3>
            <button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold">Add Exam</button>
          </div>
        </motion.div>

        {showForm && (
          <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-white rounded-xl shadow-lg p-8 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={addExam}>
            {['subject','type','date','time','duration','location','notes'].map((field, i) =>
              <div key={i} className={field==='notes'?'md:col-span-2':''}>
                {field==='type'?(
                  <select value={newExam.type} onChange={e => setNewExam({...newExam, type:e.target.value})} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    {['Midterm','Final','Quiz','Project'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : field==='duration'?(
                  <select value={newExam.duration} onChange={e => setNewExam({...newExam, duration:Number(e.target.value)})} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    {[60,90,120,180,240].map(d => <option key={d} value={d}>{d/60} hr{d>60?'s':''}</option>)}
                  </select>
                ) : field==='notes'?(
                  <textarea rows={3} value={newExam.notes} onChange={e => setNewExam({...newExam, notes:e.target.value})} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Notes"/>
                ) : (
                  <input type={field==='date'?'date':field==='time'?'time':'text'} required value={(newExam as any)[field]} onChange={e => setNewExam({...newExam, [field]:e.target.value})} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder={field}/>
                )}
              </div>
            )}
            <div className="md:col-span-2 flex space-x-4">
              <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold">Add Exam</button>
              <button type="button" onClick={()=>setShowForm(false)} className="bg-gray-300 px-6 py-3 rounded-lg font-semibold">Cancel</button>
            </div>
          </motion.form>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Upcoming Exams</h2>
          {exams.length===0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4"/>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No exams scheduled</h3>
              <p className="text-gray-500">Add your first exam to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {exams.map((exam,i)=>(
                <motion.div key={exam.id} initial={{opacity:0,y:50}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:i*0.1}} whileHover={{y:-5}} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{exam.subject}</h3>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm font-medium">{exam.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`px-3 py-1 rounded-full border text-sm font-medium ${urgencyClass(exam.daysLeft)}`}>
                        {exam.daysLeft===0?'Today!':exam.daysLeft===1?'Tomorrow':exam.daysLeft<0?'Passed':`${exam.daysLeft} days`}
                      </div>
                      <button onClick={()=>deleteExam(exam.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="h-4 w-4"/></button>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4 text-gray-600">
                    <div className="flex items-center"><Calendar className="h-4 w-4 mr-2"/>{new Date(exam.date).toLocaleDateString()}</div>
                    <div className="flex items-center"><Clock className="h-4 w-4 mr-2"/>{exam.time} • {exam.duration} min</div>
                    <div className="flex items-center"><AlertCircle className="h-4 w-4 mr-2"/>{exam.location}</div>
                  </div>
                  {exam.notes && <div className="bg-gray-50 rounded-lg p-3"><p className="text-sm">{exam.notes}</p></div>}
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
