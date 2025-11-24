import { Notice, MotivationItem, ExamPaper, BlogPost } from '../types';

const CONTENT_STORAGE_KEY = 'bt-jee-tracker-content';
const CUSTOM_EXAMS_KEY = 'bt-jee-tracker-custom-exams';

interface ContentData {
    notices: Notice[];
    motivation: MotivationItem[];
    blogs: BlogPost[];
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
    ],
    blogs: [
        {
            id: 'b1',
            title: 'The Art of Managing Backlogs',
            excerpt: 'Falling behind is normal. Staying behind is a choice. Here is a practical framework to clear your JEE backlogs without compromising current topics.',
            content: `## The Backlog Nightmare
Every JEE aspirant faces it. You miss a week due to sickness, a family function, or simply because a topic like *Rotational Motion* or *Ionic Equilibrium* just didn't click. Suddenly, you have a mountain of unwatched lectures and unsolved DPPs.

The anxiety of backlog is often more damaging than the backlog itself. Here is a battle-tested strategy to conquer it without ruining your current preparation.

### Rule #1: Stop the Bleeding 🩸
The biggest mistake students make is **pausing current topics to cover old ones**.
*   **Scenario:** You have a backlog in *Kinematics*, and the class is currently doing *Work Power Energy*.
*   **Mistake:** You skip WPE classes to finish Kinematics.
*   **Result:** Now WPE becomes a backlog. You are stuck in a vicious cycle.

**The Fix:** Always attend current classes. Even if you don't understand 100% because of the backlog, grasp whatever you can. Do not create new backlogs to kill old ones.

### Rule #2: The Triage Method 🏥
Not all backlogs are created equal. You need to categorize them:
1.  **The Pillars (High Priority):** Topics that are prerequisites for future chapters.
    *   *Examples:* GOC, Mole Concept, Vectors, Newton's Laws.
    *   *Action:* These need proper lectures and understanding.
2.  **The Islands (Medium Priority):** Important but independent.
    *   *Examples:* Quadratic Equations, Chemical Bonding.
    *   *Action:* Cover these on weekends.
3.  **The Fillers (Low Priority):** Low weightage or formula-based.
    *   *Examples:* Units & Dimensions, Surface Chemistry.
    *   *Action:* Read NCERT, check formula sheets, solve PYQs directly. Don't watch 10-hour lectures for these.

### Rule #3: The "Sunday Rule" 🗓️
Do not try to squeeze backlog coverage into your Monday-Saturday schedule if it's already packed (School + Coaching + HW). You will burn out.
*   **The Strategy:** Allocate 4-6 hours exclusively on **Sundays** (or your holiday) for backlogs.
*   Treat it like a separate subject.

### Rule #4: Smart Resources 🧠
You don't have the luxury of time anymore.
*   **Don't:** Watch full-length, 2-hour lectures for every sub-topic.
*   **Do:** Use "One-Shot" revision videos (2-3 hours for a chapter) to get the gist.
*   **Do:** Focus on **Solved Examples**. They teach you *how* to apply formulas faster than reading theory.

### Summary
Backlogs are normal. They don't define your rank; how you handle them does. Prioritize your current track, use Sundays wisely, and focus on weightage rather than completion. You got this!`,
            author: 'Admin',
            date: new Date().toISOString().split('T')[0],
            readTime: '6 min read',
            category: 'Strategy',
            imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 'b2',
            title: 'Sleep: The Underrated Rank Booster',
            excerpt: 'Why pulling all-nighters might be destroying your rank. The science of memory consolidation and why 7 hours is non-negotiable.',
            content: `## The Myth of the "Hustle"
We see it all the time. "I studied 16 hours yesterday!" usually means "I stared at a book for 16 hours while half-asleep." Quality always beats quantity.

### The Science: Why Your Brain Needs Sleep for JEE
JEE isn't a memorization exam; it's an application exam.
1.  **Deep Sleep (Physical Restoration):** Repairs the body and refreshes focus.
2.  **REM Sleep (Mental Restoration):** This is where the magic happens. Your brain connects unrelated ideas and moves data from short-term to long-term memory. That "click" moment you get while solving a tricky Rotational Motion problem? That often happens because of REM sleep processing.

If you cut sleep to 5 hours, you aren't just losing 2 hours of rest; you are cutting off the **most critical REM cycles** that happen in the early morning. You are literally deleting the memory of what you studied yesterday.

### The Caffeine Trap ☕
Coffee blocks adenosine receptors (the chemical that makes you tired), but it doesn't remove the fatigue. Once the caffeine wears off, all that built-up adenosine hits you at once (the crash).
*   **Rule:** No coffee after 2 PM. It has a half-life of ~6 hours and destroys sleep quality.

### The Golden Routine for Aspirants 🌙
1.  **Fixed Wake-up Time:** Your body loves rhythm. Waking up at 6 AM one day and 9 AM the next creates "Social Jetlag," making you groggy.
2.  **The "Worry Dump":** Can't sleep because you're thinking about Backlogs? Write them down 1 hour before bed. Tell your brain: "It's on paper, we'll handle it tomorrow."
3.  **No Screens 1hr before bed:** Blue light kills melatonin (sleep hormone). Read a physical novel or Organic Chemistry NCERT instead (it puts anyone to sleep!).
4.  **Nap Strategically:** 20 mins (Power Nap) is a reset button. 90 mins (Full Cycle) is okay. Anything in between (e.g., 1 hour) leaves you with "Sleep Inertia" (groggy state).

### Summary
Sleep is not a waste of time; it is a **study state**. You are strengthening neural pathways while you dream. Respect the pillow to respect the rank.`,
            author: 'Admin',
            date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
            readTime: '5 min read',
            category: 'Mental Health',
            imageUrl: 'https://images.unsplash.com/photo-1541781777621-afb1b3a41175?auto=format&fit=crop&w=800&q=80'
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

    // --- Blogs ---
    getBlogs: () => getContent().blogs,

    addBlog: (blog: Omit<BlogPost, 'id' | 'date' | 'readTime'>) => {
        const data = getContent();
        // Calculate simple read time (approx 200 words per min)
        const wordCount = blog.content.split(' ').length;
        const mins = Math.ceil(wordCount / 200);
        
        const newBlog: BlogPost = {
            ...blog,
            id: crypto.randomUUID(),
            date: new Date().toISOString().split('T')[0],
            readTime: `${mins} min read`
        };
        data.blogs.unshift(newBlog);
        saveContent(data);
        return newBlog;
    },

    deleteBlog: (id: string) => {
        const data = getContent();
        data.blogs = data.blogs.filter(b => b.id !== id);
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
