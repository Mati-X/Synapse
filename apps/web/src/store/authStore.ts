import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('synapse_auth_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        set({ error: data.error || 'Login failed', isLoading: false });
        return false;
      }

      const { user, token } = await res.json();
      localStorage.setItem('synapse_auth_token', token);
      set({ user, token, isLoading: false, error: null });
      return true;
    } catch {
      set({ error: 'Network error connecting to backend', isLoading: false });
      return false;
    }
  },

  register: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!res.ok) {
        const data = await res.json();
        set({ error: data.error || 'Registration failed', isLoading: false });
        return false;
      }

      const { user, token } = await res.json();
      localStorage.setItem('synapse_auth_token', token);
      set({ user, token, isLoading: false, error: null });
      return true;
    } catch {
      set({ error: 'Network error connecting to backend', isLoading: false });
      return false;
    }
  },

  logout: () => {
    const token = localStorage.getItem('synapse_auth_token');
    if (token) {
      fetch(`${apiUrl}/api/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem('synapse_auth_token');
    set({ user: null, token: null, error: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('synapse_auth_token');
    if (!token) return;

    set({ isLoading: true });
    try {
      const res = await fetch(`${apiUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const { user } = await res.json();
        set({ user, token, isLoading: false });
      } else {
        localStorage.removeItem('synapse_auth_token');
        set({ user: null, token: null, isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
