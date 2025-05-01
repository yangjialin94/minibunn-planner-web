import { create } from "zustand";

type UserState = {
  name: string;
  email: string;

  setName: (name: string) => void;
  setEmail: (email: string) => void;
};

export const useUserStore = create<UserState>((set) => ({
  name: "",
  email: "",

  setName: (name: string) => set({ name }),
  setEmail: (email: string) => set({ email }),
}));
