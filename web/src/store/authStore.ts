import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  _hasHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setAuth: (user, token) => set({ user, token }),

      logout: () => {
        set({ user: null, token: null });
        ["auth-storage", "user-settings", "pinicofit-workout-storage"].forEach(
          (key) => localStorage.removeItem(key),
        );
      },

      updateProfile: (data) =>
        set((state) => {
          if (!state.user) return { user: null };
          const updatedUser = { ...state.user };

          if (data.preferences) {
            updatedUser.preferences = {
              ...updatedUser.preferences,
              ...data.preferences,
            };
          } else {
            Object.assign(updatedUser, data);
          }

          return { user: updatedUser };
        }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
