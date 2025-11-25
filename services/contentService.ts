
import { Notice, MotivationItem, ExamPaper, BlogPost } from '../types';
import { api } from './api';

export const contentService = {
    // --- Notices ---
    getNotices: async (): Promise<Notice[]> => {
        return await api.content.getNotices();
    },
    
    addNotice: async (notice: Omit<Notice, 'id' | 'date'>) => {
        const newNotice: Notice = {
            ...notice,
            id: crypto.randomUUID(),
            date: new Date().toISOString().split('T')[0]
        };
        await api.content.addNotice(newNotice);
        return newNotice;
    },

    deleteNotice: async (id: string) => {
        await api.content.deleteNotice(id);
    },

    // --- Motivation ---
    getMotivation: async (): Promise<MotivationItem[]> => {
        return await api.content.getMotivation();
    },

    getRandomMotivation: async (): Promise<MotivationItem> => {
        const items = await api.content.getMotivation();
        if (items.length === 0) return { id: 'default', type: 'quote', content: 'Keep pushing!', author: 'Admin' };
        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
    },

    addMotivation: async (item: Omit<MotivationItem, 'id'>) => {
        const newItem: MotivationItem = {
            ...item,
            id: crypto.randomUUID()
        };
        await api.content.addMotivation(newItem);
        return newItem;
    },

    deleteMotivation: async (id: string) => {
        await api.content.deleteMotivation(id);
    },

    // --- Blogs ---
    getBlogs: async (): Promise<BlogPost[]> => {
        return await api.content.getBlogs();
    },

    addBlog: async (blog: Omit<BlogPost, 'id' | 'date' | 'readTime'>) => {
        const wordCount = blog.content.split(' ').length;
        const mins = Math.ceil(wordCount / 200);
        
        const newBlog: BlogPost = {
            ...blog,
            id: crypto.randomUUID(),
            date: new Date().toISOString().split('T')[0],
            readTime: `${mins} min read`
        };
        await api.content.addBlog(newBlog);
        return newBlog;
    },

    deleteBlog: async (id: string) => {
        await api.content.deleteBlog(id);
    },

    // --- Custom Exams ---
    getCustomExams: async (): Promise<ExamPaper[]> => {
        return await api.exams.getCustom();
    },

    addCustomExam: async (exam: ExamPaper) => {
        await api.exams.addCustom(exam);
    },

    deleteCustomExam: async (id: string) => {
        await api.exams.deleteCustom(id);
    }
};
