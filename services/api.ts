
/**
 * API Abstraction Layer
 * 
 * This file serves as the interface between the Frontend UI and the Data Store.
 * CURRENT STATE: Simulates a Database using LocalStorage.
 * FUTURE STATE: Replace internal logic with fetch/axios calls to Node.js Backend.
 */

import { User, Notice, MotivationItem, BlogPost, ExamPaper, DBChapterProgress, TopicProgress, Status, WeeklySchedule, TopicPracticeStats } from "../types";
import { INITIAL_PROGRESS } from "../constants";

const STORAGE_PREFIX = 'bt-jee-tracker-';

// --- HELPER: Simulate Network Delay ---
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// --- HELPER: LocalStorage Wrapper ---
const getStore = <T>(key: string, defaultVal: T): T => {
    try {
        const item = localStorage.getItem(STORAGE_PREFIX + key);
        return item ? JSON.parse(item) : defaultVal;
    } catch {
        return defaultVal;
    }
};

const setStore = <T>(key: string, value: T) => {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
};

export const api = {
    // 1. USERS (Auth)
    users: {
        getAll: async (): Promise<User[]> => {
            await delay();
            return getStore<User[]>('users-db', []);
        },
        getById: async (id: string): Promise<User | undefined> => {
            await delay();
            const users = getStore<User[]>('users-db', []);
            return users.find(u => u.id === id);
        },
        getByEmail: async (email: string): Promise<User | undefined> => {
            await delay();
            const users = getStore<User[]>('users-db', []);
            return users.find(u => u.email.toLowerCase() === email.toLowerCase());
        },
        create: async (user: User): Promise<User> => {
            await delay();
            const users = getStore<User[]>('users-db', []);
            const newUser = { 
                ...user, 
                created_at: new Date().toISOString(), 
                updated_at: new Date().toISOString() 
            };
            users.push(newUser);
            setStore('users-db', users);
            return newUser;
        },
        update: async (user: User): Promise<User> => {
            await delay();
            const users = getStore<User[]>('users-db', []);
            const idx = users.findIndex(u => u.id === user.id);
            if (idx !== -1) {
                users[idx] = { ...user, updated_at: new Date().toISOString() };
                setStore('users-db', users);
                return users[idx];
            }
            throw new Error("User not found");
        },
        delete: async (email: string) => {
            await delay();
            const users = getStore<User[]>('users-db', []);
            const newUsers = users.filter(u => u.email !== email);
            setStore('users-db', newUsers);
            // Cleanup related data
            localStorage.removeItem(STORAGE_PREFIX + `progress-${email}`);
            localStorage.removeItem(STORAGE_PREFIX + `practice-${email}`);
        }
    },

    // 2. PROGRESS
    progress: {
        // Maps DB Flat structure to Frontend Nested structure
        getByUser: async (userEmail: string): Promise<Record<string, TopicProgress>> => {
            await delay();
            // Simulating SQL: SELECT * FROM chapter_progress WHERE user_id = ...
            const rawData = getStore<Record<string, TopicProgress>>(`progress-${userEmail}`, {});
            
            // Migration logic to ensure data integrity (Mocking DB Defaults)
            const hydratedData: Record<string, TopicProgress> = {};
            
            // If using real SQL, we would loop through rows here. 
            // For LocalStorage simulation, we stick to the existing JSON structure but structure the call like an API.
            Object.keys(INITIAL_PROGRESS).forEach(topicId => {
                if (rawData[topicId]) {
                    hydratedData[topicId] = rawData[topicId];
                } else {
                    hydratedData[topicId] = { ...INITIAL_PROGRESS[topicId] };
                }
            });
            
            return hydratedData;
        },
        
        save: async (userEmail: string, progress: Record<string, TopicProgress>) => {
            await delay();
            // Simulating SQL: UPDATE chapter_progress SET ...
            setStore(`progress-${userEmail}`, progress);
        }
    },

    // 3. PRACTICE STATS
    practice: {
        get: async (userEmail: string): Promise<Record<string, TopicPracticeStats>> => {
            await delay();
            return getStore(`practice-${userEmail}`, {});
        },
        save: async (userEmail: string, stats: Record<string, TopicPracticeStats>) => {
            await delay();
            setStore(`practice-${userEmail}`, stats);
        }
    },

    // 4. TIMETABLES
    timetable: {
        get: async (userEmail: string): Promise<WeeklySchedule | null> => {
            await delay();
            return getStore(`timetable-${userEmail}`, null);
        },
        save: async (userEmail: string, schedule: WeeklySchedule | null) => {
            await delay();
            setStore(`timetable-${userEmail}`, schedule);
        }
    },

    // 5. CONTENT (Notices, Motivation, Blogs)
    content: {
        getNotices: async (): Promise<Notice[]> => {
            await delay();
            const data = getStore<{notices: Notice[]}>('content', { notices: [] });
            return data.notices;
        },
        addNotice: async (notice: Notice) => {
            await delay();
            const data = getStore<any>('content', { notices: [] });
            data.notices.unshift(notice);
            setStore('content', data);
        },
        deleteNotice: async (id: string) => {
            await delay();
            const data = getStore<any>('content', { notices: [] });
            data.notices = data.notices.filter((n: Notice) => n.id !== id);
            setStore('content', data);
        },

        getMotivation: async (): Promise<MotivationItem[]> => {
            await delay();
            const data = getStore<{motivation: MotivationItem[]}>('content', { motivation: [] });
            return data.motivation;
        },
        addMotivation: async (item: MotivationItem) => {
            await delay();
            const data = getStore<any>('content', { motivation: [] });
            data.motivation.push(item);
            setStore('content', data);
        },
        deleteMotivation: async (id: string) => {
            await delay();
            const data = getStore<any>('content', { motivation: [] });
            data.motivation = data.motivation.filter((m: MotivationItem) => m.id !== id);
            setStore('content', data);
        },

        getBlogs: async (): Promise<BlogPost[]> => {
            await delay();
            const data = getStore<{blogs: BlogPost[]}>('content', { blogs: [] });
            return data.blogs;
        },
        addBlog: async (blog: BlogPost) => {
            await delay();
            const data = getStore<any>('content', { blogs: [] });
            data.blogs.unshift(blog);
            setStore('content', data);
        },
        deleteBlog: async (id: string) => {
            await delay();
            const data = getStore<any>('content', { blogs: [] });
            data.blogs = data.blogs.filter((b: BlogPost) => b.id !== id);
            setStore('content', data);
        }
    },

    // 6. EXAMS
    exams: {
        getCustom: async (): Promise<ExamPaper[]> => {
            await delay();
            return getStore('custom-exams', []);
        },
        addCustom: async (exam: ExamPaper) => {
            await delay();
            const exams = getStore<ExamPaper[]>('custom-exams', []);
            exams.push(exam);
            setStore('custom-exams', exams);
        },
        deleteCustom: async (id: string) => {
            await delay();
            const exams = getStore<ExamPaper[]>('custom-exams', []);
            setStore('custom-exams', exams.filter(e => e.id !== id));
        }
    }
};
