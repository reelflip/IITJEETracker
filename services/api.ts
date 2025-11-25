

/**
 * API Abstraction Layer
 * Connects React Frontend to Node.js/MySQL Backend.
 */

import { User, Notice, MotivationItem, BlogPost, ExamPaper, TopicProgress, WeeklySchedule, TopicPracticeStats } from "../types";
import { INITIAL_PROGRESS } from "../constants";

// CHANGE THIS URL TO YOUR HOSTINGER BACKEND URL (e.g., 'https://api.yourdomain.com/api')
const API_BASE = 'http://localhost:3001/api';

const headers = { 'Content-Type': 'application/json' };

export const api = {
    // 1. USERS (Auth)
    users: {
        getAll: async (): Promise<User[]> => {
            const res = await fetch(`${API_BASE}/users`);
            return res.json();
        },
        getById: async (id: string): Promise<User | undefined> => {
            const res = await fetch(`${API_BASE}/users/${id}`);
            return res.ok ? res.json() : undefined;
        },
        getByEmail: async (email: string): Promise<User | undefined> => {
            const res = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email)}`);
            if (res.ok) {
                const data = await res.json();
                return Array.isArray(data) ? data[0] : data;
            }
            return undefined;
        },
        register: async (user: User): Promise<User> => {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers,
                body: JSON.stringify(user)
            });
            if (!res.ok) throw new Error('Registration failed');
            return user;
        },
        login: async (email: string, password: string): Promise<{user: User} | null> => {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ email, password })
            });
            if (!res.ok) return null;
            return res.json(); // Expects { success: true, user: {...} }
        },
        update: async (user: User): Promise<User> => {
            const res = await fetch(`${API_BASE}/users/${user.id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(user)
            });
            if (!res.ok) throw new Error('Update failed');
            return user;
        },
        delete: async (email: string) => {
            await fetch(`${API_BASE}/users/${email}`, { method: 'DELETE' });
        }
    },

    // 2. PROGRESS
    progress: {
        getByUser: async (userId: string): Promise<Record<string, TopicProgress>> => {
            const res = await fetch(`${API_BASE}/progress/${userId}`);
            const data = await res.json();
            
            // Merge with Initial Syllabus to ensure all topics exist
            const merged: Record<string, TopicProgress> = {};
            Object.keys(INITIAL_PROGRESS).forEach(key => {
                merged[key] = data[key] || { ...INITIAL_PROGRESS[key] };
            });
            return merged;
        },
        save: async (userId: string, topicProgress: TopicProgress) => {
            await fetch(`${API_BASE}/progress`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ userId, ...topicProgress })
            });
        }
    },

    // 3. PRACTICE STATS
    practice: {
        get: async (userId: string): Promise<Record<string, TopicPracticeStats>> => {
            const res = await fetch(`${API_BASE}/practice/${userId}`);
            return res.ok ? res.json() : {};
        },
        save: async (userId: string, stat: TopicPracticeStats) => {
            await fetch(`${API_BASE}/practice`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ userId, ...stat })
            });
        }
    },

    // 4. TIMETABLES
    timetable: {
        get: async (userId: string): Promise<WeeklySchedule | null> => {
            const res = await fetch(`${API_BASE}/timetables/${userId}`);
            return res.ok ? res.json() : null;
        },
        save: async (userId: string, schedule: WeeklySchedule | null) => {
            await fetch(`${API_BASE}/timetables`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ userId, schedule })
            });
        }
    },

    // 5. CONTENT
    content: {
        getNotices: async (): Promise<Notice[]> => {
            const res = await fetch(`${API_BASE}/content/notices`);
            return res.ok ? res.json() : [];
        },
        addNotice: async (notice: Notice) => {
            await fetch(`${API_BASE}/content/notices`, { method: 'POST', headers, body: JSON.stringify(notice) });
        },
        deleteNotice: async (id: string) => {
            await fetch(`${API_BASE}/content/notices/${id}`, { method: 'DELETE' });
        },

        getMotivation: async (): Promise<MotivationItem[]> => {
            const res = await fetch(`${API_BASE}/content/motivation`);
            return res.ok ? res.json() : [];
        },
        addMotivation: async (item: MotivationItem) => {
            await fetch(`${API_BASE}/content/motivation`, { method: 'POST', headers, body: JSON.stringify(item) });
        },
        deleteMotivation: async (id: string) => {
            await fetch(`${API_BASE}/content/motivation/${id}`, { method: 'DELETE' });
        },

        getBlogs: async (): Promise<BlogPost[]> => {
            const res = await fetch(`${API_BASE}/content/blogs`);
            return res.ok ? res.json() : [];
        },
        addBlog: async (blog: BlogPost) => {
            await fetch(`${API_BASE}/content/blogs`, { method: 'POST', headers, body: JSON.stringify(blog) });
        },
        deleteBlog: async (id: string) => {
            await fetch(`${API_BASE}/content/blogs/${id}`, { method: 'DELETE' });
        }
    },

    // 6. EXAMS
    exams: {
        getCustom: async (): Promise<ExamPaper[]> => {
            const res = await fetch(`${API_BASE}/exams/custom`);
            return res.ok ? res.json() : [];
        },
        addCustom: async (exam: ExamPaper) => {
            await fetch(`${API_BASE}/exams/custom`, { method: 'POST', headers, body: JSON.stringify(exam) });
        },
        deleteCustom: async (id: string) => {
            await fetch(`${API_BASE}/exams/custom/${id}`, { method: 'DELETE' });
        }
    }
};