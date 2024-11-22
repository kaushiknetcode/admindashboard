import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// User credentials mapping
const USERS: Array<User & { password: string }> = [
  // Super Admin
  { id: 'admin', username: 'super_admin', password: 'admin2024', role: 'SUPER_ADMIN', placeId: 0 },
  
  // APOs
  { id: 'apo1', username: 'hq_apo', password: 'hq2024', role: 'APO', placeId: 1 },
  { id: 'apo2', username: 'malda_apo', password: 'malda2024', role: 'APO', placeId: 2 },
  { id: 'apo3', username: 'hwh_apo', password: 'hwh2024', role: 'APO', placeId: 3 },
  { id: 'apo4', username: 'sdah_apo', password: 'sdah2024', role: 'APO', placeId: 4 },
  { id: 'apo5', username: 'llh_apo', password: 'llh2024', role: 'APO', placeId: 5 },
  { id: 'apo6', username: 'kpa_apo', password: 'kpa2024', role: 'APO', placeId: 6 },
  { id: 'apo7', username: 'jmp_apo', password: 'jmp2024', role: 'APO', placeId: 7 },
  { id: 'apo8', username: 'asl_apo', password: 'asl2024', role: 'APO', placeId: 8 },
  
  // POs
  { id: 'po1', username: 'hq_po', password: 'hq@2024', role: 'PO', placeId: 1 },
  { id: 'po2', username: 'malda_po', password: 'malda@2024', role: 'PO', placeId: 2 },
  { id: 'po3', username: 'hwh_po', password: 'hwh@2024', role: 'PO', placeId: 3 },
  { id: 'po4', username: 'sdah_po', password: 'sdah@2024', role: 'PO', placeId: 4 },
  { id: 'po5', username: 'llh_po', password: 'llh@2024', role: 'PO', placeId: 5 },
  { id: 'po6', username: 'kpa_po', password: 'kpa@2024', role: 'PO', placeId: 6 },
  { id: 'po7', username: 'jmp_po', password: 'jmp@2024', role: 'PO', placeId: 7 },
  { id: 'po8', username: 'asl_po', password: 'asl@2024', role: 'PO', placeId: 8 },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async (username: string, password: string) => {
        const user = USERS.find(u => u.username === username && u.password === password);
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          const token = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }));
          set({ user: userWithoutPassword, token });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
      storage: localStorage,
    }
  )
);