import { create } from "zustand";

type UserState = {
  name: string;
  email: string;
  isSubscribed: boolean;

  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setIsSubscribed: (isSubscribed: boolean) => void;
};

export const useUserStore = create<UserState>((set) => {
  return {
    name: "",
    email: "",
    isSubscribed: false,

    setName: (name: string) => set({ name }),
    setEmail: (email: string) => set({ email }),
    setIsSubscribed: (isSubscribed: boolean) => set({ isSubscribed }),
  };
});
