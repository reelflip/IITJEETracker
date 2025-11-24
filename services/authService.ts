
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
        
        const filteredUsers = users.filter(u => u.email !== 'admin@prep.com' && u.email !== 'vikas.00@gmail.com');

        const admin: User = {
            id: 'admin-001',
            name: 'Admin',
            email: 'vikas.00@gmail.com',
            coachingInstitute: 'Head Office',
            targetYear: 'IIT JEE 2025',
            passwordHash: hashPassword('Ishika@123'),
            role: 'admin',
            securityQuestion: "What is the name of your first pet?",
            securityAnswer: "admin" // Simple default answer
        };
        
        filteredUsers.push(admin);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filteredUsers));
        
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

  updateUser: (updatedUser: User) => {
    const users = authService.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        // Update session if it's the current user
        const session = authService.getSession();
        if (session && session.id === updatedUser.id) {
            authService.setSession(updatedUser);
        }
    }
  },

  // New method for partial profile updates
  updateProfile: (userId: string, updates: Partial<User>): { success: boolean; message?: string; user?: User } => {
      const users = authService.getUsers();
      const index = users.findIndex(u => u.id === userId);
      
      if (index === -1) return { success: false, message: "User not found" };

      const updatedUser = { ...users[index], ...updates };
      users[index] = updatedUser;
      
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      
      // Update session if it's the current user
      const session = authService.getSession();
      if (session && session.id === userId) {
          authService.setSession(updatedUser);
      }

      return { success: true, user: updatedUser };
  },

  deleteUser: (email: string) => {
    const users = authService.getUsers();
    const newUsers = users.filter(u => u.email !== email);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers));
    localStorage.removeItem(`bt-jee-tracker-progress-${email}`);
    localStorage.removeItem(`bt-jee-tracker-practice-${email}`);
  },

  register: (name: string, email: string, password: string, coaching: string, targetYear: string, question: string, answer: string, role: 'student' | 'parent' = 'student'): { success: boolean; message?: string; user?: User } => {
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
      securityAnswer: answer.toLowerCase().trim()
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    
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

  // Recover Password Step 1: Get the question
  getSecurityQuestion: (email: string): { success: boolean; question?: string; message?: string } => {
    const users = authService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) return { success: false, message: 'User not found.' };
    if (!user.securityQuestion) return { success: false, message: 'No security question set for this account. Contact Admin.' };
    
    return { success: true, question: user.securityQuestion };
  },

  // Recover Password Step 2: Verify and Reset
  resetPassword: (email: string, answer: string, newPassword: string): { success: boolean; message?: string } => {
    const users = authService.getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (userIndex === -1) return { success: false, message: 'User not found.' };
    
    const user = users[userIndex];
    if (user.securityAnswer !== answer.toLowerCase().trim()) {
        return { success: false, message: 'Incorrect security answer.' };
    }

    // Update password
    users[userIndex].passwordHash = hashPassword(newPassword);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    return { success: true, message: 'Password reset successfully. Please login.' };
  },

  // --- PARENT CONNECTION LOGIC ---

  sendConnectionRequest: (parentId: string, studentEmail: string): { success: boolean; message: string } => {
      const users = authService.getUsers();
      const student = users.find(u => u.email.toLowerCase() === studentEmail.toLowerCase() && u.role === 'student');
      const parent = users.find(u => u.id === parentId);

      if (!student) return { success: false, message: 'Student ID (Email) not found.' };
      if (!parent) return { success: false, message: 'Parent session invalid.' };

      if (student.linkedUserId) return { success: false, message: 'Student is already connected to a parent.' };
      if (student.connectionRequestFrom) return { success: false, message: 'Student already has a pending request.' };

      // Set Request
      student.connectionRequestFrom = parentId;
      authService.updateUser(student);

      return { success: true, message: 'Request sent! Waiting for student approval.' };
  },

  acceptConnectionRequest: (studentId: string, parentId: string): { success: boolean; message: string } => {
      const users = authService.getUsers();
      const student = users.find(u => u.id === studentId);
      const parent = users.find(u => u.id === parentId);

      if (!student || !parent) return { success: false, message: 'User not found.' };

      // Link them
      student.linkedUserId = parent.id;
      student.connectionRequestFrom = undefined; // Clear request
      
      parent.linkedUserId = student.id;

      authService.updateUser(student);
      authService.updateUser(parent);

      return { success: true, message: 'Connected successfully!' };
  },

  rejectConnectionRequest: (studentId: string) => {
      const users = authService.getUsers();
      const student = users.find(u => u.id === studentId);
      if (student) {
          student.connectionRequestFrom = undefined;
          authService.updateUser(student);
      }
  },

  // Helper to get connected user details
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
