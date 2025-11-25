
import { Notice, MotivationItem, ExamPaper, BlogPost } from '../types';
import { api } from './api';

// Seed content via API logic is handled internally in api.ts for this simulation phase.
// The service now just exposes cleaner methods.

export const contentService = {
    // --- Notices ---
    getNotices: (): Notice[] => {
        // Sync wrapper for UI
        try {
            const item = localStorage.getItem('bt-jee-tracker-content');
            return item ? JSON.parse(item).notices : [];
        } catch { return []; }
    },
    
    addNotice: (notice: Omit<Notice, 'id' | 'date'>) => {
        const newNotice: Notice = {
            ...notice,
            id: crypto.randomUUID(),
            date: new Date().toISOString().split('T')[0]
        };
        api.content.addNotice(newNotice);
        return newNotice; // Optimistic return
    },

    deleteNotice: (id: string) => {
        api.content.deleteNotice(id);
    },

    // --- Motivation ---
    getMotivation: (): MotivationItem[] => {
        try {
            const item = localStorage.getItem('bt-jee-tracker-content');
            return item ? JSON.parse(item).motivation : [];
        } catch { return []; }
    },

    getRandomMotivation: (): MotivationItem => {
        const items = contentService.getMotivation();
        if (items.length === 0) return { id: 'default', type: 'quote', content: 'Keep pushing!', author: 'Admin' };
        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
    },

    addMotivation: (item: Omit<MotivationItem, 'id'>) => {
        const newItem: MotivationItem = {
            ...item,
            id: crypto.randomUUID()
        };
        api.content.addMotivation(newItem);
        return newItem;
    },

    deleteMotivation: (id: string) => {
        api.content.deleteMotivation(id);
    },

    // --- Blogs ---
    getBlogs: (): BlogPost[] => {
        try {
            const item = localStorage.getItem('bt-jee-tracker-content');
            return item ? JSON.parse(item).blogs : [];
        } catch { return []; }
    },

    addBlog: (blog: Omit<BlogPost, 'id' | 'date' | 'readTime'>) => {
        const wordCount = blog.content.split(' ').length;
        const mins = Math.ceil(wordCount / 200);
        
        const newBlog: BlogPost = {
            ...blog,
            id: crypto.randomUUID(),
            date: new Date().toISOString().split('T')[0],
            readTime: `${mins} min read`
        };
        api.content.addBlog(newBlog);
        return newBlog;
    },

    deleteBlog: (id: string) => {
        api.content.deleteBlog(id);
    },

    // --- Custom Exams ---
    getCustomExams: (): ExamPaper[] => {
        try {
            const item = localStorage.getItem('bt-jee-tracker-custom-exams');
            return item ? JSON.parse(item) : [];
        } catch { return []; }
    },

    addCustomExam: (exam: ExamPaper) => {
        api.exams.addCustom(exam);
    },

    deleteCustomExam: (id: string) => {
        api.exams.deleteCustom(id);
    }
};
