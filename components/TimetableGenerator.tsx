
import React, { useState } from 'react';
import { generateWeeklyTimetable } from '../services/geminiService';
import { CalendarClock, Loader2, Save, School, Moon, BookOpen, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const TimetableGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Form State
  const [coachingDays, setCoachingDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);
  const [coachingStart, setCoachingStart] = useState('17:30');
  const [coachingEnd, setCoachingEnd] = useState('20:30');
  
  const [attendsSchool, setAttendsSchool] = useState(true);
  const [schoolStart, setSchoolStart] = useState('08:00');
  const [schoolEnd, setSchoolEnd] = useState('14:00');

  const [wakeTime, setWakeTime] = useState('06:00');
  const [bedTime, setBedTime] = useState('23:00');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    if (coachingDays.includes(day)) {
      setCoachingDays(coachingDays.filter(d => d !== day));
    } else {
      setCoachingDays([...coachingDays, day]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    const timetable = await generateWeeklyTimetable({
      coachingDays,
      coachingTime: { start: coachingStart, end: coachingEnd },
      schoolDetails: { attending: attendsSchool, start: schoolStart, end: schoolEnd },
      sleepSchedule: { wake: wakeTime, bed: bedTime }
    });
    setResult(timetable);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Configuration Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
             <div className="flex items-center gap-2 mb-2">
                <CalendarClock className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold">Timetable Config</h2>
             </div>
             <p className="text-orange-50 text-sm">Define your fixed commitments to find your study slots.</p>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Coaching Section */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <BookOpen size={16} /> Coaching Schedule
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {daysOfWeek.map(day => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                      coachingDays.includes(day)
                        ? 'bg-bt-blue text-white shadow-md'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Start Time</label>
                  <input type="time" value={coachingStart} onChange={e => setCoachingStart(e.target.value)} className="w-full text-sm border p-2 rounded" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">End Time</label>
                  <input type="time" value={coachingEnd} onChange={e => setCoachingEnd(e.target.value)} className="w-full text-sm border p-2 rounded" />
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* School Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <School size={16} /> School / College
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={attendsSchool} onChange={e => setAttendsSchool(e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
              
              <div className={`transition-all duration-300 ${attendsSchool ? 'opacity-100 max-h-40' : 'opacity-50 max-h-40 pointer-events-none grayscale'}`}>
                 <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">School Starts</label>
                      <input type="time" value={schoolStart} onChange={e => setSchoolStart(e.target.value)} className="w-full text-sm border p-2 rounded" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">School Ends</label>
                      <input type="time" value={schoolEnd} onChange={e => setSchoolEnd(e.target.value)} className="w-full text-sm border p-2 rounded" />
                    </div>
                 </div>
              </div>
              {!attendsSchool && <p className="text-xs text-green-600 mt-2 font-medium">Dummy school selected. Full day available.</p>}
            </div>

            <hr className="border-gray-100" />

            {/* Sleep Section */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Moon size={16} /> Sleep Schedule
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                   <label className="text-xs text-gray-500 mb-1 block">Wake Up</label>
                   <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} className="w-full text-sm border p-2 rounded" />
                </div>
                <div>
                   <label className="text-xs text-gray-500 mb-1 block">Bed Time</label>
                   <input type="time" value={bedTime} onChange={e => setBedTime(e.target.value)} className="w-full text-sm border p-2 rounded" />
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Clock />}
              Generate Timetable
            </button>
          </div>
        </div>
      </div>

      {/* Result Panel */}
      <div className="lg:col-span-2">
        {result ? (
           <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 h-full animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Your Weekly Schedule</h3>
                <button onClick={() => window.print()} className="text-gray-500 hover:text-bt-blue flex items-center gap-2 text-sm font-medium">
                   <Save size={16} /> Print / Save PDF
                </button>
             </div>
             <div className="prose prose-orange max-w-none prose-headings:font-bold prose-h3:text-lg prose-p:text-gray-600 prose-li:text-gray-600" style={{fontSize: '0.95rem'}}>
               <ReactMarkdown>{result}</ReactMarkdown>
             </div>
           </div>
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-gray-300 rounded-xl h-full min-h-[400px] flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <CalendarClock size={64} className="mb-4 opacity-20" />
            <h3 className="text-lg font-semibold text-gray-500">No Timetable Generated Yet</h3>
            <p className="max-w-xs mt-2 text-sm">Configure your coaching days and school hours on the left, then click "Generate Timetable" to see your optimal study routine.</p>
          </div>
        )}
      </div>
    </div>
  );
};
