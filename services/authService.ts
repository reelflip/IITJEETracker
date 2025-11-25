
import { User } from '../types';
import { api } from './api';

const SESSION_KEY = 'bt-jee-tracker-current-session';

// Simple "hashing" for simulation
const hashPassword = (password: string) => btoa(password).split('').reverse().join('');

// Seed default admin if not exists
const seedAdmin = async () => {
    try {
        const users = await api.users.getAll();
        if (!users.find(u => u.email === 'vikas.00@gmail.com')) {
            const admin: User = {
                id: 'admin-001',
                name: 'Admin',
                email: 'vikas.00@gmail.com',
                coachingInstitute: 'Head Office',
                targetYear: 'IIT JEE 2025',
                passwordHash: hashPassword('Ishika@123'),
                role: 'admin',
                securityQuestion: "What is the name of your first pet?",
                securityAnswer: "admin"
            };
            await api.users.create(admin);
        }
    } catch (e) {
        console.error("Error seeding admin", e);
    }
};

seedAdmin();

export const authService = {
  getUsers: (): User[] => {
    // Synchronous wrapper for compatibility with UI components that expect instant data
    // In a real React Query / SWR implementation, this would be async.
    // For now, we read directly from localStorage for list views to avoid major UI refactor.
    try {
      const item = localStorage.getItem('bt-jee-tracker-users-db');
      return item ? JSON.parse(item) : [];
    } catch { return []; }
  },

  updateUser: async (updatedUser: User) => {
    await api.users.update(updatedUser);
    const session = authService.getSession();
    if (session && session.id === updatedUser.id) {
        authService.setSession(updatedUser);
    }
  },

  updateProfile: (userId: string, updates: Partial<User>): { success: boolean; message?: string; user?: User } => {
      // Synchronous facade for immediate UI feedback
      const users = authService.getUsers();
      const index = users.findIndex(u => u.id === userId);
      
      if (index === -1) return { success: false, message: "User not found" };

      const updatedUser = { ...users[index], ...updates, updated_at: new Date().toISOString() };
      users[index] = updatedUser;
      
      localStorage.setItem('bt-jee-tracker-users-db', JSON.stringify(users));
      
      const session = authService.getSession();
      if (session && session.id === userId) {
          authService.setSession(updatedUser);
      }

      return { success: true, user: updatedUser };
  },

  deleteUser: async (email: string) => {
    await api.users.delete(email);
  },

  register: (name: string, email: string, password: string, coaching: string, targetYear: string, question: string, answer: string, role: 'student' | 'parent' = 'student'): { success: boolean; message?: string; user?: User } => {
    // Sync check for immediate feedback
    const users = authService.getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Email already registered.' };
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email: email.toLowerCase(),
      coachingInstitute: coaching,
      targetYear: targetYear,
      passwordHash: hashPassword(password),
      role: role,
      securityQuestion: question,
      securityAnswer: answer.toLowerCase().trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('bt-jee-tracker-users-db', JSON.stringify(users));
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

  getSecurityQuestion: (email: string): { success: boolean; question?: string; message?: string } => {
    const users = authService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) return { success: false, message: 'User not found.' };
    if (!user.securityQuestion) return { success: false, message: 'No security question set.' };
    
    return { success: true, question: user.securityQuestion };
  },

  resetPassword: (email: string, answer: string, newPassword: string): { success: boolean; message?: string } => {
    const users = authService.getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (userIndex === -1) return { success: false, message: 'User not found.' };
    
    const user = users[userIndex];
    if (user.securityAnswer !== answer.toLowerCase().trim()) {
        return { success: false, message: 'Incorrect security answer.' };
    }

    users[userIndex].passwordHash = hashPassword(newPassword);
    users[userIndex].updated_at = new Date().toISOString();
    localStorage.setItem('bt-jee-tracker-users-db', JSON.stringify(users));

    return { success: true, message: 'Password reset successfully. Please login.' };
  },

  // Snapshot Logic
  generateStudentSnapshot: (user: User) => {
      const snapshot = {
          user: user,
          progress: localStorage.getItem(`bt-jee-tracker-progress-${user.email}`),
          practice: localStorage.getItem(`bt-jee-tracker-practice-${user.email}`),
          timetable: localStorage.getItem(`bt-jee-tracker-timetable-${user.email}`),
          generatedAt: new Date().toISOString()
      };
      return JSON.stringify(snapshot, null, 2);
  },

  importStudentSnapshot: (jsonString: string): { success: boolean; message: string } => {
      try {
          const data = JSON.parse(jsonString);
          if (!data.user || !data.user.email) return { success: false, message: "Invalid snapshot file." };
          
          const users = authService.getUsers();
          const existingIndex = users.findIndex(u => u.email === data.user.email);
          if (existingIndex !== -1) {
              users[existingIndex] = data.user; 
          } else {
              users.push(data.user);
          }
          localStorage.setItem('bt-jee-tracker-users-db', JSON.stringify(users));

          if (data.progress) localStorage.setItem(`bt-jee-tracker-progress-${data.user.email}`, data.progress);
          if (data.practice) localStorage.setItem(`bt-jee-tracker-practice-${data.user.email}`, data.practice);
          if (data.timetable) localStorage.setItem(`bt-jee-tracker-timetable-${data.user.email}`, data.timetable);

          return { success: true, message: `Successfully imported data for ${data.user.name}` };
      } catch (e) {
          return { success: false, message: "Error parsing snapshot file." };
      }
  },

  // Parent Connection Logic
  sendConnectionRequest: (parentId: string, studentEmail: string): { success: boolean; message: string } => {
      const users = authService.getUsers();
      const student = users.find(u => u.email.toLowerCase() === studentEmail.toLowerCase() && u.role === 'student');
      const parent = users.find(u => u.id === parentId);

      if (!student) return { success: false, message: 'Student ID (Email) not found.' };
      if (!parent) return { success: false, message: 'Parent session invalid.' };

      if (student.linkedUserId) return { success: false, message: 'Student is already connected to a parent.' };
      if (student.connectionRequestFrom) return { success: false, message: 'Student already has a pending request.' };

      student.connectionRequestFrom = parentId;
      
      // Save via direct write to emulate API update
      const index = users.findIndex(u => u.id === student.id);
      users[index] = student;
      localStorage.setItem('bt-jee-tracker-users-db', JSON.stringify(users));

      return { success: true, message: 'Request sent! Waiting for student approval.' };
  },

  acceptConnectionRequest: (studentId: string, parentId: string): { success: boolean; message: string } => {
      const users = authService.getUsers();
      const studentIndex = users.findIndex(u => u.id === studentId);
      const parentIndex = users.findIndex(u => u.id === parentId);

      if (studentIndex === -1 || parentIndex === -1) return { success: false, message: 'User not found.' };

      users[studentIndex].linkedUserId = users[parentIndex].id;
      users[studentIndex].connectionRequestFrom = undefined;
      users[parentIndex].linkedUserId = users[studentIndex].id;

      localStorage.setItem('bt-jee-tracker-users-db', JSON.stringify(users));

      return { success: true, message: 'Connected successfully!' };
  },

  rejectConnectionRequest: (studentId: string) => {
      const users = authService.getUsers();
      const index = users.findIndex(u => u.id === studentId);
      if (index !== -1) {
          users[index].connectionRequestFrom = undefined;
          localStorage.setItem('bt-jee-tracker-users-db', JSON.stringify(users));
      }
  },

  getLinkedUser: (currentUserId: string): User | null => {
      const users = authService.getUsers();
      const currentUser = users.find(u => u.id === currentUserId);
      if (!currentUser || !currentUser.linkedUserId) return null;
      return users.find(u => u.id === currentUser.linkedUserId) || null;
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
