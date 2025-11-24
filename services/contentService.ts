
import { Notice, MotivationItem, ExamPaper } from '../types';

const CONTENT_STORAGE_KEY = 'bt-jee-tracker-content';
const CUSTOM_EXAMS_KEY = 'bt-jee-tracker-custom-exams';

interface ContentData {
    notices: Notice[];
    motivation: MotivationItem[];
}

// Seed Data
const DEFAULT_CONTENT: ContentData = {
    notices: [
        {
            id: 'n1',
            title: 'Mock Test Schedule Update',
            content: 'The Major Test 3 has been rescheduled to next Sunday. Please prepare accordingly.',
            date: new Date().toISOString().split('T')[0],
            isImportant: true
        },
        {
            id: 'n2',
            title: 'Holiday Announcement',
            content: 'Institute will remain closed on Wednesday due to public holiday.',
            date: new Date().toISOString().split('T')[0],
            isImportant: false
        }
    ],
    motivation: [
        {
            id: 'm1',
            type: 'quote',
            content: "You don't have to be great to start, but you have to start to be great.",
            author: "Zig Ziglar"
        },
        {
            id: 'm2',
            type: 'quote',
            content: "Success is the sum of small efforts, repeated day in and day out.",
            author: "Robert Collier"
        },
        {
            id: 'm3',
            type: 'quote',
            content: "The difference between ordinary and extraordinary is that little extra.",
            author: "Jimmy Johnson"
        }
    ]
};

const getContent = (): ContentData => {
    try {
        const stored = localStorage.getItem(CONTENT_STORAGE_KEY);
        return stored ? JSON.parse(stored) : DEFAULT_CONTENT;
    } catch {
        return DEFAULT_CONTENT;
    }
};

const saveContent = (data: ContentData) => {
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(data));
};

// --- EXAM STORAGE ---
const getCustomExams = (): ExamPaper[] => {
    try {
        const stored = localStorage.getItem(CUSTOM_EXAMS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const saveCustomExams = (exams: ExamPaper[]) => {
    localStorage.setItem(CUSTOM_EXAMS_KEY, JSON.stringify(exams));
};

export const contentService = {
    // --- Notices ---
    getNotices: () => getContent().notices,
    
    addNotice: (notice: Omit<Notice, 'id' | 'date'>) => {
        const data = getContent();
        const newNotice: Notice = {
            ...notice,
            id: crypto.randomUUID(),
            date: new Date().toISOString().split('T')[0]
        };
        data.notices.unshift(newNotice); // Add to top
        saveContent(data);
        return newNotice;
    },

    deleteNotice: (id: string) => {
        const data = getContent();
        data.notices = data.notices.filter(n => n.id !== id);
        saveContent(data);
    },

    // --- Motivation ---
    getMotivation: () => getContent().motivation,

    getRandomMotivation: (): MotivationItem => {
        const items = getContent().motivation;
        if (items.length === 0) return { id: 'default', type: 'quote', content: 'Keep pushing!', author: 'Admin' };
        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
    },

    addMotivation: (item: Omit<MotivationItem, 'id'>) => {
        const data = getContent();
        const newItem: MotivationItem = {
            ...item,
            id: crypto.randomUUID()
        };
        data.motivation.push(newItem);
        saveContent(data);
        return newItem;
    },

    deleteMotivation: (id: string) => {
        const data = getContent();
        data.motivation = data.motivation.filter(m => m.id !== id);
        saveContent(data);
    },

    // --- Custom Exams ---
    getCustomExams: () => getCustomExams(),

    addCustomExam: (exam: ExamPaper) => {
        const exams = getCustomExams();
        exams.push(exam);
        saveCustomExams(exams);
    },

    deleteCustomExam: (id: string) => {
        const exams = getCustomExams();
        const filtered = exams.filter(e => e.id !== id);
        saveCustomExams(filtered);
    }
};
