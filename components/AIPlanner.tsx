
import React, { useState } from 'react';
import { generateStudyPlan } from '../services/geminiService';
import { SYLLABUS_DATA } from '../constants';
import { Loader2, Sparkles, Calendar, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const AIPlanner: React.FC = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [days, setDays] = useState(7);
  const [hours, setHours] = useState(4);
  const [focus, setFocus] = useState('Balanced');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);

  const handleTopicToggle = (topicName: string) => {
    if (selectedTopics.includes(topicName)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topicName));
    } else {
      setSelectedTopics([...selectedTopics, topicName]);
    }
  };

  const handleGenerate = async () => {
    if (selectedTopics.length === 0) return;
    setLoading(true);
    setPlan(null);
    const result = await generateStudyPlan({
      topics: selectedTopics,
      daysAvailable: days,
      hoursPerDay: hours,
      focusArea: focus
    });
    setPlan(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-bt-blue to-blue-700 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            <h2 className="text-2xl font-bold">Smart Study Planner</h2>
          </div>
          <p className="text-blue-100">
            Select your weak topics and let our algorithmic engine create a personalized Bakliwal-style schedule.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Topic Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Topics to Cover</label>
            <div className="h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {SYLLABUS_DATA.map(topic => (
                <div 
                  key={topic.id} 
                  onClick={() => handleTopicToggle(topic.name)}
                  className={`cursor-pointer p-2 rounded text-sm border flex items-center gap-2 transition-all ${
                    selectedTopics.includes(topic.name) 
                      ? 'bg-blue-100 border-blue-400 text-blue-800' 
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${
                    selectedTopics.includes(topic.name) ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                  {topic.name}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-right">{selectedTopics.length} topics selected</p>
          </div>

          {/* Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Days Available</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input 
                  type="number" 
                  min={1} 
                  max={60} 
                  value={days} 
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hours / Day</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input 
                  type="number" 
                  min={1} 
                  max={16} 
                  value={hours} 
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Focus Area</label>
              <select 
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bt-blue outline-none bg-white"
              >
                <option value="Theory Intensive">Theory First</option>
                <option value="Problem Solving">Problem Solving Heavy</option>
                <option value="Balanced">Balanced (Theory + Problems)</option>
                <option value="Revision & Mock Tests">Revision & Mock Tests</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || selectedTopics.length === 0}
            className="w-full bg-bt-blue hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            Generate Schedule
          </button>
        </div>
      </div>

      {plan && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Your Custom Study Plan</h3>
          <div className="prose prose-blue max-w-none">
            <ReactMarkdown>{plan}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};