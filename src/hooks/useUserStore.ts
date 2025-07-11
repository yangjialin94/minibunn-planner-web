import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = {
  name: string;
  email: string;
  isSubscribed: boolean;

  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setIsSubscribed: (isSubscribed: boolean) => void;
  clearStore: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: "",
      email: "",
      isSubscribed: false,

      setName: (name: string) => set({ name }),
      setEmail: (email: string) => set({ email }),
      setIsSubscribed: (isSubscribed: boolean) => set({ isSubscribed }),
      clearStore: () => set({ name: "", email: "", isSubscribed: false }),
    }),
    {
      name: "user-store",
      // Optional: you can specify which parts of the state to persist
      // partialize: (state) => ({ name: state.name, email: state.email, isSubscribed: state.isSubscribed }),
    },
  ),
);
