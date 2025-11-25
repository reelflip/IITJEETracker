
import React, { useEffect, useState } from 'react';
import { Notice, MotivationItem } from '../types';
import { contentService } from '../services/contentService';
import { Bell, Megaphone, Quote, Calendar, AlertCircle } from 'lucide-react';

export const NoticeBoard: React.FC = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [motivation, setMotivation] = useState<MotivationItem | null>(null);

    useEffect(() => {
        const load = async () => {
            setNotices(await contentService.getNotices());
            setMotivation(await contentService.getRandomMotivation());
        };
        load();
    }, []);

    if (!motivation && notices.length === 0) return null;

    // ... (JSX remains the same) ...
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
            {/* ... */}
            <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Student Notice Board</h3>
            </div>
            {/* ... Content Mapping ... */}
            {notices.map(n => <div key={n.id} className="p-4 border-b">{n.title}</div>)}
        </div>
    );
};
