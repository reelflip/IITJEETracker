
import { User } from '../types';

const USERS_STORAGE_KEY = 'bt-jee-tracker-users-db';
const SESSION_KEY = 'bt-jee-tracker-current-session';

// Simple "hashing" for simulation (Not secure for real production apps)
const hashPassword = (password: string) => btoa(password).split('').reverse().join('');

// Seed default admin if not exists
const seedAdmin = () => {
    try {
        const usersStr = localStorage.getItem(USERS_STORAGE_KEY);
        const users: User[] = usersStr ? JSON.parse(usersStr) : [];
        
        if (!users.find(u => u.role === 'admin')) {
            const admin: User = {
                id: 'admin-001',
                name: 'System Administrator',
                email: 'admin@prep.com',
                coachingInstitute: 'Head Office',
                passwordHash: hashPassword('admin123'),
                role: 'admin'
            };
            users.push(admin);
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        }
    } catch (e) {
        console.error("Error seeding admin", e);
    }
};

seedAdmin();

export const authService = {
  getUsers: (): User[] => {
    try {
      const usersStr = localStorage.getItem(USERS_STORAGE_KEY);
      return usersStr ? JSON.parse(usersStr) : [];
    } catch {
      return [];
    }
  },

  deleteUser: (email: string) => {
    const users = authService.getUsers();
    const newUsers = users.filter(u => u.email !== email);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers));
    // Also clean up their progress data
    localStorage.removeItem(`bt-jee-tracker-progress-${email}`);
  },

  register: (name: string, email: string, password: string, coaching: string): { success: boolean; message?: string; user?: User } => {
    const users = authService.getUsers();
    
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Email already registered.' };
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email: email.toLowerCase(),
      coachingInstitute: coaching,
      passwordHash: hashPassword(password),
      role: 'student'
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    
    // Auto login
    authService.setSession(newUser);
    
    return { success: true, user: newUser };
  },

  login: (email: string, password: string): { success: boolean; message?: string; user?: User } => {
    const users = authService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, message: 'User not found.' };
    }

    if (user.passwordHash !== hashPassword(password)) {
      return { success: false, message: 'Incorrect password.' };
    }

    authService.setSession(user);
    return { success: true, user };
  },

  setSession: (user: User) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },

  getSession: (): User | null => {
    try {
      const sessionStr = localStorage.getItem(SESSION_KEY);
      return sessionStr ? JSON.parse(sessionStr) : null;
    } catch {
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  }
};
