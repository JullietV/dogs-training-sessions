import { TaskSession } from '../types/types';

const STORAGE_KEY = 'sessions';

export const sessionStorage = {
  getSessions: (): TaskSession[] => {
    if (typeof window === 'undefined') return [];
    const sessions = localStorage.getItem(STORAGE_KEY);
    return sessions ? JSON.parse(sessions) : [];
  },

  saveSessions: (sessions: TaskSession[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  },

  saveSession: (session: TaskSession) => {
    if (typeof window === 'undefined') return;
    const sessions = sessionStorage.getSessions();
    sessions.push(session);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  },

  migrateOldSessions: () => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('training-sessions');
    
    const existingSessions = localStorage.getItem(STORAGE_KEY);
    if (!existingSessions) {
      localStorage.setItem(STORAGE_KEY, '[]');
    }
  }
}; 