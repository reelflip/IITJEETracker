
import React, { useEffect, useState } from 'react';
import { Notice, MotivationItem } from '../types';
import { contentService } from '../services/contentService';
import { Bell, Megaphone, Quote, Calendar, AlertCircle } from 'lucide-react';

export const NoticeBoard: React.FC = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [motivation, setMotivation] = useState<MotivationItem | null>(null);

    useEffect(() => {
        setNotices(contentService.getNotices());
        setMotivation(contentService.getRandomMotivation());
    }, []);

    if (!motivation && notices.length === 0) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
            
            {/* Daily Motivation Card */}
            <div className="lg:col-span-1 flex flex-col">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-1 shadow-lg flex-1 flex flex-col">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-t-lg flex items-center gap-2 text-white/90 border-b border-white/10">
                        <Quote size={18} className="text-yellow-300" />
                        <h3 className="font-bold text-sm tracking-wide uppercase">Daily Motivation</h3>
                    </div>
                    
                    <div className="flex-1 p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
                        {/* Decorative Circles */}
                        <div className="absolute top-0 left-0 w-24 h-24 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"></div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 blur-xl"></div>

                        {motivation ? (
                            motivation.type === 'image' ? (
                                <div className="w-full h-48 rounded-lg overflow-hidden shadow-md border-2 border-white/20">
                                    <img src={motivation.content} alt="Motivation" className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="z-10">
                                    <p className="text-white text-lg md:text-xl font-serif italic leading-relaxed">
                                        "{motivation.content}"
                                    </p>
                                    {motivation.author && (
                                        <div className="mt-4 flex justify-center items-center gap-2">
                                            <div className="h-px w-8 bg-yellow-300/50"></div>
                                            <p className="text-yellow-100 text-sm font-medium uppercase tracking-wider">{motivation.author}</p>
                                            <div className="h-px w-8 bg-yellow-300/50"></div>
                                        </div>
                                    )}
                                </div>
                            )
                        ) : (
                            <p className="text-white/70">Loading inspiration...</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Notice Board */}
            <div className="lg:col-span-2">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
                    <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Megaphone className="text-orange-500" size={20} />
                            <h3 className="font-bold text-gray-800">Student Notice Board</h3>
                        </div>
                        <span className="text-xs font-semibold bg-white text-orange-600 px-2 py-1 rounded border border-orange-200">
                            {notices.length} Updates
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[250px] p-4 space-y-3 scrollbar-thin">
                        {notices.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm py-8">
                                <Bell className="mb-2 opacity-50" />
                                No new notices from Admin.
                            </div>
                        ) : (
                            notices.map((notice) => (
                                <div key={notice.id} className={`p-4 rounded-lg border transition-all hover:shadow-sm ${
                                    notice.isImportant ? 'bg-red-50 border-red-100 border-l-4 border-l-red-500' : 'bg-gray-50 border-gray-100 border-l-4 border-l-blue-400'
                                }`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`font-bold text-sm ${notice.isImportant ? 'text-red-800' : 'text-gray-800'}`}>
                                            {notice.isImportant && <AlertCircle size={12} className="inline mr-1 -mt-0.5" />}
                                            {notice.title}
                                        </h4>
                                        <span className="text-[10px] text-gray-500 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-gray-200">
                                            <Calendar size={10} /> {notice.date}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {notice.content}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
