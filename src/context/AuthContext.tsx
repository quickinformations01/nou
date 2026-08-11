import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, NotificationItem, AdminSettings } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  settings: AdminSettings | null;
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  switchPersona: (role: 'student' | 'admin' | 'faculty', userId?: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  markNotifsAsRead: () => Promise<void>;
  reloadSettings: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('nou_jwt_token'));
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const settingsData = await api.getSettings();
      setSettings(settingsData);

      if (token) {
        try {
          const { user: currentUser } = await api.getCurrentUser();
          setUser(currentUser);
          const notifList = await api.getNotifications();
          setNotifications(notifList);
        } catch {
          // Fallback to demo default admin if token stale
          localStorage.removeItem('nou_jwt_token');
          setToken(null);
        }
      }
    } catch (err) {
      console.error('Failed to load initial auth context:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [token]);

  const login = async (email: string, password?: string) => {
    const res = await api.login(email, password);
    localStorage.setItem('nou_jwt_token', res.token);
    setToken(res.token);
    setUser(res.user);
    const notifs = await api.getNotifications();
    setNotifications(notifs);
  };

  const register = async (payload: any) => {
    const res = await api.register(payload);
    localStorage.setItem('nou_jwt_token', res.token);
    setToken(res.token);
    setUser(res.user);
    const notifs = await api.getNotifications();
    setNotifications(notifs);
  };

  const logout = () => {
    localStorage.removeItem('nou_jwt_token');
    setToken(null);
    setUser(null);
  };

  const switchPersona = async (role: 'student' | 'admin' | 'faculty', userId?: string) => {
    const res = await api.switchPersona(role, userId);
    localStorage.setItem('nou_jwt_token', res.token);
    setToken(res.token);
    setUser(res.user);
    const notifs = await api.getNotifications();
    setNotifications(notifs);
  };

  const refreshNotifications = async () => {
    if (!user) return;
    try {
      const notifs = await api.getNotifications();
      setNotifications(notifs);
    } catch (e) {
      console.error(e);
    }
  };

  const markNotifsAsRead = async () => {
    await api.markNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const reloadSettings = async () => {
    const s = await api.getSettings();
    setSettings(s);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        settings,
        notifications,
        unreadCount,
        loading,
        login,
        register,
        logout,
        switchPersona,
        refreshNotifications,
        markNotifsAsRead,
        reloadSettings
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
