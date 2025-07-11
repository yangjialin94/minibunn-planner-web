import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = {
  name: string;
  email: string;
  isSubscribed: boolean;
};

interface UserActions {
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setIsSubscribed: (isSubscribed: boolean) => void;
  clearStore: () => void;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()(
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
    },
  ),
);
