import { defineStore } from 'pinia';
import type { LoginPayload, User } from '@/types/auth';

const STORAGE_KEY = 'dashboard-maj-auth';

interface MockUser extends User {
  password: string;
}

const mockUsers: MockUser[] = [
  {
    username: 'manager',
    password: 'manager123',
    fullname: 'Manajer Pabrik',
    role: 'Manajer'
  },
  {
    username: 'supervisor',
    password: 'supervisor123',
    fullname: 'Supervisor Line',
    role: 'Supervisor'
  }
];

function getStoredUser(): User | null {
  const rawUser = localStorage.getItem(STORAGE_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: getStoredUser() as User | null
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user)
  },
  actions: {
    async login(payload: LoginPayload) {
      const matchedUser = mockUsers.find(
        (user) => user.username === payload.username.trim() && user.password === payload.password
      );

      await new Promise((resolve) => window.setTimeout(resolve, 500));

      if (!matchedUser) {
        throw new Error('Username atau password tidak sesuai.');
      }

      const { password: _password, ...safeUser } = matchedUser;
      this.user = safeUser;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
    },
    logout() {
      this.user = null;
      localStorage.removeItem(STORAGE_KEY);
    }
  }
});
