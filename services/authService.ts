
import { User } from '../types';
import { api } from './api';

const SESSION_KEY = 'bt-jee-tracker-current-session';

// Simple hash function (still needed for client-side matching if not strictly checking hash on server yet, 
// but ideally hashing happens on server. We'll send raw/hashed to server.)
const hashPassword = (password: string) => btoa(password).split('').reverse().join('');

export const authService = {
  getUsers: async (): Promise<User[]> => {
    try {
        return await api.users.getAll();
    } catch { return []; }
  },

  updateUser: async (updatedUser: User) => {
    await api.users.update(updatedUser);
    const session = authService.getSession();
    if (session && session.id === updatedUser.id) {
        authService.setSession(updatedUser);
    }
  },

  updateProfile: async (userId: string, updates: Partial<User>): Promise<{ success: boolean; message?: string; user?: User }> => {
      try {
          const user = await api.users.getById(userId);
          if (!user) return { success: false, message: "User not found" };

          const updatedUser = { ...user, ...updates };
          await api.users.update(updatedUser);
          
          const session = authService.getSession();
          if (session && session.id === userId) {
              authService.setSession(updatedUser);
          }

          return { success: true, user: updatedUser };
      } catch (e) {
          return { success: false, message: "Update failed" };
      }
  },

  deleteUser: async (email: string) => {
    await api.users.delete(email);
  },

  register: async (name: string, email: string, password: string, coaching: string, targetYear: string, question: string, answer: string, role: 'student' | 'parent' = 'student'): Promise<{ success: boolean; message?: string; user?: User }> => {
    try {
        const newUser: User = {
            id: crypto.randomUUID(),
            name,
            email: email.toLowerCase(),
            coachingInstitute: coaching,
            targetYear: targetYear,
            passwordHash: hashPassword(password),
            role: role,
            securityQuestion: question,
            securityAnswer: answer.toLowerCase().trim()
        };

        await api.users.register(newUser);
        authService.setSession(newUser);
        return { success: true, user: newUser };
    } catch (e) {
        return { success: false, message: 'Registration failed. Email might exist.' };
    }
  },

  login: async (email: string, password: string): Promise<{ success: boolean; message?: string; user?: User }> => {
    try {
        // In production, send password to server to check hash. 
        // Here we simulate by checking return.
        const result = await api.users.login(email, password);
        
        if (!result || !result.user) {
             return { success: false, message: 'Invalid credentials' };
        }
        
        // Simple client-side hash check fallback if server returns user but didn't check hash (depending on server implementation)
        if (result.user.passwordHash !== hashPassword(password)) {
             return { success: false, message: 'Incorrect password' };
        }

        authService.setSession(result.user);
        return { success: true, user: result.user };
    } catch (e) {
        return { success: false, message: 'Login error' };
    }
  },

  getSecurityQuestion: async (email: string): Promise<{ success: boolean; question?: string; message?: string }> => {
    const user = await api.users.getByEmail(email);
    if (!user) return { success: false, message: 'User not found.' };
    if (!user.securityQuestion) return { success: false, message: 'No security question set.' };
    return { success: true, question: user.securityQuestion };
  },

  resetPassword: async (email: string, answer: string, newPassword: string): Promise<{ success: boolean; message?: string }> => {
    const user = await api.users.getByEmail(email);
    if (!user) return { success: false, message: 'User not found.' };
    
    if (user.securityAnswer !== answer.toLowerCase().trim()) {
        return { success: false, message: 'Incorrect security answer.' };
    }

    user.passwordHash = hashPassword(newPassword);
    await api.users.update(user);

    return { success: true, message: 'Password reset successfully. Please login.' };
  },

  // Parent Connection Logic
  sendConnectionRequest: async (parentId: string, studentEmail: string): Promise<{ success: boolean; message: string }> => {
      const student = await api.users.getByEmail(studentEmail);
      if (!student || student.role !== 'student') return { success: false, message: 'Student ID not found.' };

      if (student.linkedUserId) return { success: false, message: 'Student already connected.' };
      
      student.connectionRequestFrom = parentId;
      await api.users.update(student);

      return { success: true, message: 'Request sent!' };
  },

  acceptConnectionRequest: async (studentId: string, parentId: string): Promise<{ success: boolean; message: string }> => {
      const student = await api.users.getById(studentId);
      const parent = await api.users.getById(parentId);

      if (!student || !parent) return { success: false, message: 'User not found.' };

      student.linkedUserId = parent.id;
      student.connectionRequestFrom = undefined; // Clear
      parent.linkedUserId = student.id;

      await api.users.update(student);
      await api.users.update(parent);

      return { success: true, message: 'Connected successfully!' };
  },

  rejectConnectionRequest: async (studentId: string) => {
      const student = await api.users.getById(studentId);
      if (student) {
          student.connectionRequestFrom = undefined;
          await api.users.update(student);
      }
  },

  getLinkedUser: async (currentUserId: string): Promise<User | null> => {
      const currentUser = await api.users.getById(currentUserId);
      if (!currentUser || !currentUser.linkedUserId) return null;
      return (await api.users.getById(currentUser.linkedUserId)) || null;
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
  },

  // Snapshot helpers (can remain local logic for now or fetch full dump from API)
  generateStudentSnapshot: async (user: User) => {
      // Fetch fresh data
      const progress = await api.progress.getByUser(user.id);
      // ... other fetches
      const snapshot = {
          user,
          progress,
          generatedAt: new Date().toISOString()
      };
      return JSON.stringify(snapshot, null, 2);
  }
};
