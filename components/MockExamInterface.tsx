
import React, { useState, useEffect } from 'react';
import { PAST_PAPERS_METADATA, generateMockPaper } from '../constants';
import { contentService } from '../services/contentService'; // Import content service
import { ExamPaper, QuestionPaletteStatus, Question, ExamResult } from '../types';
import { Clock, Flag, RotateCcw, ChevronRight, Grid, User, ArrowLeft, Star } from 'lucide-react';

// --- SUB-COMPONENT: ACTIVE EXAM SESSION ---
// This isolates the exam logic and hooks (timer, effects) so they are only mounted when needed.
// This prevents "Invalid Hook Call" errors caused by conditional rendering in the parent.

interface ActiveExamSessionProps {
    paper: ExamPaper;
    onFinish: (result: ExamResult) => void;
}

const ActiveExamSession: React.FC<ActiveExamSessionProps> = ({ paper, onFinish }) => {
    // State
    const [timeLeft, setTimeLeft] = useState(paper.durationMinutes * 60);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [statusMap, setStatusMap] = useState<Record<string, QuestionPaletteStatus>>({});
    const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});

    // Timer Effect
    useEffect(() => {
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    // Visited Status Effect (Fix for Error #310/185 - Side effect in render)
    useEffect(() => {
        const currentSection = paper.sections[currentSectionIndex];
        const currentQ = currentSection.questions[currentQuestionIndex];
        if (currentQ && currentQ.id) {
            const qId = currentQ.id;
            // Only update if not already set to avoid infinite loops
            if (!statusMap[qId]) {
                setStatusMap(prev => ({ ...prev, [qId]: QuestionPaletteStatus.NOT_ANSWERED }));
            }
        }
    }, [currentSectionIndex, currentQuestionIndex, paper, statusMap]);

    // Helpers
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const currentSection = paper.sections[currentSectionIndex];
    const currentQ = currentSection.questions[currentQuestionIndex];
    const qId = currentQ.id!;

    const handleOptionSelect = (opt: string) => {
        setAnswers(prev => ({ ...prev, [qId]: opt }));
    };

    const handleSaveNext = () => {
        // Update status based on logic
        const isAnswered = !!answers[qId];
        const isMarked = !!markedForReview[qId];

        let newStatus = QuestionPaletteStatus.NOT_ANSWERED;
        if (isAnswered) newStatus = isMarked ? QuestionPaletteStatus.ANSWERED_AND_MARKED : QuestionPaletteStatus.ANSWERED;
        else if (isMarked) newStatus = QuestionPaletteStatus.MARKED_FOR_REVIEW;

        setStatusMap(prev => ({ ...prev, [qId]: newStatus }));

        // Move Next
        if (currentQuestionIndex < currentSection.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else if (currentSectionIndex < paper.sections.length - 1) {
            // Next Section
            setCurrentSectionIndex(prev => prev + 1);
            setCurrentQuestionIndex(0);
        }
    };

    const handleMarkForReview = () => {
        const newVal = !markedForReview[qId];
        setMarkedForReview(prev => ({ ...prev, [qId]: newVal }));
        
        // Immediate visual update in map
        const isAnswered = !!answers[qId];
        let newStatus = QuestionPaletteStatus.NOT_ANSWERED;
        
        if (newVal) { 
            newStatus = isAnswered ? QuestionPaletteStatus.ANSWERED_AND_MARKED : QuestionPaletteStatus.MARKED_FOR_REVIEW;
        } else { 
            newStatus = isAnswered ? QuestionPaletteStatus.ANSWERED : QuestionPaletteStatus.NOT_ANSWERED;
        }
        setStatusMap(prev => ({ ...prev, [qId]: newStatus }));
    };

    const handleClear = () => {
        const newAnswers = { ...answers };
        delete newAnswers[qId];
        setAnswers(newAnswers);
        
        if (markedForReview[qId]) {
            setStatusMap(prev => ({ ...prev, [qId]: QuestionPaletteStatus.MARKED_FOR_REVIEW }));
        } else {
            setStatusMap(prev => ({ ...prev, [qId]: QuestionPaletteStatus.NOT_ANSWERED }));
        }
    };

    const handleSubmit = () => {
        let correct = 0;
        let wrong = 0;
        let attempted = 0;
        let totalQ = 0;

        paper.sections.forEach(sec => {
            sec.questions.forEach(q => {
                totalQ++;
                const userAns = answers[q.id!];
                if (userAns) {
                    attempted++;
                    if (userAns === q.correctAnswer) correct++;
                    else wrong++;
                }
            });
        });

        const score = (correct * 4) - (wrong * 1);
        
        const result: ExamResult = {
            examId: paper.id,
            score,
            totalQuestions: totalQ,
            attempted,
            correct,
            wrong,
            accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
            timeTaken: formatTime((paper.durationMinutes * 60) - timeLeft)
        };
        
        onFinish(result);
    };

    const getPaletteColor = (q: Question) => {
        const status = statusMap[q.id!] || QuestionPaletteStatus.NOT_VISITED;
        switch (status) {
            case QuestionPaletteStatus.ANSWERED: return 'bg-green-500 text-white border-green-600';
            case QuestionPaletteStatus.NOT_ANSWERED: return 'bg-red-500 text-white border-red-600';
            case QuestionPaletteStatus.MARKED_FOR_REVIEW: return 'bg-purple-600 text-white border-purple-700';
            case QuestionPaletteStatus.ANSWERED_AND_MARKED: return 'bg-purple-600 text-white border-purple-700 ring-2 ring-green-400';
            default: return 'bg-gray-100 text-gray-700 border-gray-300'; // Not Visited
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col bg-gray-50 -m-4 sm:-m-8">
            {/* Header */}
            <div className="bg-blue-700 text-white px-4 py-2 flex justify-between items-center shadow-md">
                <h2 className="font-bold truncate">{paper.title}</h2>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded">
                        <Clock size={16} />
                        <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
                    </div>
                    <button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600 px-4 py-1.5 rounded text-sm font-bold shadow transition-colors">
                        Submit Exam
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left: Question Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-white">
                    {/* Section Tabs */}
                    <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
                        {paper.sections.map((sec, idx) => (
                            <button
                                key={idx}
                                onClick={() => { setCurrentSectionIndex(idx); setCurrentQuestionIndex(0); }}
                                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${currentSectionIndex === idx ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                {sec.subject}
                            </button>
                        ))}
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="flex justify-between items-start mb-4 border-b pb-4">
                            <span className="font-bold text-lg text-gray-800">Question {currentQuestionIndex + 1}</span>
                            <span className="text-gray-500 text-sm font-bold bg-gray-100 px-2 py-1 rounded">Single Correct Type (+4, -1)</span>
                        </div>
                        <p className="text-lg text-gray-900 mb-8 leading-relaxed font-medium">
                            {currentQ.questionText}
                        </p>
                        <div className="space-y-3 max-w-2xl">
                            {currentQ.options.map((opt, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => handleOptionSelect(opt)}
                                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                                        answers[qId] === opt 
                                        ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' 
                                        : 'hover:bg-gray-50 border-gray-300'
                                    }`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                                        answers[qId] === opt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-300'
                                    }`}>
                                        {String.fromCharCode(65+idx)}
                                    </div>
                                    <span>{opt}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Controls */}
                    <div className="p-4 border-t border-gray-200 bg-white flex justify-between items-center shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                        <div className="flex gap-2">
                            <button onClick={handleMarkForReview} className="px-4 py-2 border border-purple-600 text-purple-700 rounded hover:bg-purple-50 font-medium text-sm flex items-center gap-2">
                                <Flag size={16} /> {markedForReview[qId] ? 'Unmark' : 'Mark for Review'}
                            </button>
                            <button onClick={handleClear} className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-medium text-sm flex items-center gap-2">
                                <RotateCcw size={16} /> Clear
                            </button>
                        </div>
                        <button onClick={handleSaveNext} className="px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold shadow flex items-center gap-2">
                            Save & Next <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Right: Palette Sidebar */}
                <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col hidden lg:flex">
                    <div className="p-4 border-b border-gray-200 bg-white">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <User size={24} className="text-gray-500" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Candidate Name</p>
                                <p className="text-xs text-gray-500">JEE Aspirant</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 grid grid-cols-2 gap-2 text-xs text-gray-600 border-b border-gray-200">
                            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded"></span> Answered</div>
                            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded"></span> Not Answered</div>
                            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-200 rounded border border-gray-300"></span> Not Visited</div>
                            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-500 rounded"></span> Marked Review</div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <h3 className="font-bold text-gray-700 mb-3 text-sm flex items-center gap-2">
                            <Grid size={14} /> Question Palette
                        </h3>
                        <div className="grid grid-cols-5 gap-2">
                            {currentSection.questions.map((q, idx) => (
                                <button 
                                    key={q.id}
                                    onClick={() => setCurrentQuestionIndex(idx)}
                                    className={`w-10 h-10 rounded border text-sm font-medium transition-all shadow-sm flex items-center justify-center ${
                                        currentQuestionIndex === idx ? 'ring-2 ring-blue-400 ring-offset-1 z-10' : ''
                                    } ${getPaletteColor(q)}`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN PARENT COMPONENT ---

export const MockExamInterface: React.FC = () => {
    const [view, setView] = useState<'list' | 'intro' | 'active' | 'result'>('list');
    const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
    const [paper, setPaper] = useState<ExamPaper | null>(null);
    const [result, setResult] = useState<ExamResult | null>(null);
    const [customExams, setCustomExams] = useState<ExamPaper[]>([]);

    // Load custom exams
    useEffect(() => {
        setCustomExams(contentService.getCustomExams());
    }, []);

    // --- VIEW 1: PAPER LIST ---
    if (view === 'list') {
        return (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in">
                <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 rounded-2xl text-white shadow-lg">
                    <h1 className="text-3xl font-bold mb-2">Previous Year Papers Archive</h1>
                    <p className="text-blue-100">Attempt actual JEE papers in a simulated NTA-style environment.</p>
                </div>

                {/* Custom Test Series Section */}
                {customExams.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Star className="text-yellow-500 fill-yellow-500" /> Admin Test Series
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {customExams.map((exam) => (
                                <div key={exam.id} className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-all flex justify-between items-center group bg-blue-50/50">
                                    <div>
                                        <h3 className="font-bold text-blue-900 text-lg group-hover:text-blue-700 transition-colors">{exam.title}</h3>
                                        <div className="flex gap-3 mt-2 text-sm text-gray-500">
                                            <span className="bg-white px-2 py-0.5 rounded flex items-center gap-1 border border-gray-200"><Clock size={14}/> {exam.durationMinutes} Mins</span>
                                            <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-green-100 text-green-700">
                                                Custom
                                            </span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setPaper(exam); // Custom papers are fully formed
                                            setView('intro');
                                        }}
                                        className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700"
                                    >
                                        Start
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Past Papers Section */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Official Past Papers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {PAST_PAPERS_METADATA.map((meta) => (
                            <div key={meta.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex justify-between items-center group">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">{meta.title}</h3>
                                    <div className="flex gap-3 mt-2 text-sm text-gray-500">
                                        <span className="bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1"><Clock size={14}/> {meta.duration} Mins</span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${meta.type === 'Mains' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                                            {meta.type}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => {
                                        setSelectedPaperId(meta.id);
                                        setView('intro');
                                    }}
                                    className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700"
                                >
                                    Start
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // --- VIEW 2: INSTRUCTIONS ---
    if (view === 'intro') {
        // Note: 'paper' might be set (Custom) or we might need to generate it (Past Paper)
        const currentTitle = paper ? paper.title : PAST_PAPERS_METADATA.find(p => p.id === selectedPaperId)?.title;
        const currentDuration = paper ? paper.durationMinutes : 180;

        return (
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-gray-50 p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Instructions - {currentTitle}</h2>
                    <p className="text-gray-500">Please read carefully before starting.</p>
                </div>
                <div className="p-8 space-y-4 text-gray-700">
                    <p>1. Total duration is <strong>{currentDuration} minutes</strong>.</p>
                    <p>2. The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination.</p>
                    <p>3. The question palette displayed on the right side of screen will show the status of each question using one of the following symbols:</p>
                    <div className="grid grid-cols-2 gap-4 my-4 pl-4 border-l-2 border-blue-500">
                        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-gray-200 border border-gray-300"></div> Not Visited</div>
                        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-red-500 text-white flex items-center justify-center text-xs"></div> Not Answered</div>
                        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-green-500 text-white flex items-center justify-center text-xs"></div> Answered</div>
                        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-purple-500 text-white flex items-center justify-center text-xs"></div> Marked for Review</div>
                    </div>
                    <p>4. <strong>Marking Scheme:</strong> Correct Answer: <span className="text-green-600 font-bold">+4</span>, Incorrect Answer: <span className="text-red-600 font-bold">-1</span>, Unanswered: 0.</p>
                </div>
                <div className="p-6 border-t border-gray-200 flex justify-between items-center bg-gray-50">
                    <button onClick={() => { setView('list'); setPaper(null); }} className="text-gray-600 font-medium hover:text-gray-900">Cancel</button>
                    <button 
                        onClick={() => {
                            if (paper) {
                                // Already loaded (Custom Exam)
                                setView('active');
                            } else if (selectedPaperId) {
                                // Needs generation (Past Paper)
                                const p = generateMockPaper(selectedPaperId);
                                if (p) {
                                    setPaper(p);
                                    setView('active');
                                }
                            }
                        }}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 shadow-md transform active:scale-95 transition-all"
                    >
                        I am ready to begin
                    </button>
                </div>
            </div>
        );
    }

    // --- VIEW 3: ACTIVE EXAM (Delegated) ---
    if (view === 'active' && paper) {
        return (
            <ActiveExamSession 
                paper={paper} 
                onFinish={(res) => {
                    setResult(res);
                    setView('result');
                }} 
            />
        );
    }

    // --- VIEW 4: RESULT ---
    if (view === 'result' && result && paper) {
        return (
            <div className="max-w-4xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
                 <button onClick={() => { setView('list'); setPaper(null); setResult(null); }} className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4">
                    <ArrowLeft size={16} /> Back to Paper List
                 </button>
                 
                 <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden text-center">
                    <div className="bg-gray-900 text-white p-8">
                        <h2 className="text-3xl font-bold mb-2">Exam Summary</h2>
                        <p className="opacity-80">{paper.title}</p>
                    </div>
                    <div className="p-8">
                        <div className="inline-block p-6 rounded-full bg-blue-50 border-4 border-blue-100 mb-6">
                            <span className="block text-5xl font-bold text-blue-600">{result.score}</span>
                            <span className="text-gray-500 font-medium">/ {paper.totalMarks} Marks</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
                             <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <p className="text-xs font-bold text-gray-500 uppercase">Attempted</p>
                                <p className="text-2xl font-bold text-gray-800">{result.attempted} <span className="text-sm font-normal text-gray-400">/ {result.totalQuestions}</span></p>
                             </div>
                             <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                                <p className="text-xs font-bold text-green-700 uppercase">Correct</p>
                                <p className="text-2xl font-bold text-green-700">{result.correct}</p>
                             </div>
                             <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                                <p className="text-xs font-bold text-red-700 uppercase">Incorrect</p>
                                <p className="text-2xl font-bold text-red-700">{result.wrong}</p>
                             </div>
                             <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
                                <p className="text-xs font-bold text-indigo-700 uppercase">Accuracy</p>
                                <p className="text-2xl font-bold text-indigo-700">{result.accuracy}%</p>
                             </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 border-t border-gray-200 text-sm text-gray-500">
                        Detailed solutions are not available in simulation mode. Check "Practice" tab for solution-enabled questions.
                    </div>
                 </div>
            </div>
        );
    }

    return null;
};
