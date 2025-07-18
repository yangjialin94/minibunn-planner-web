import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = {
  name: string;
  email: string;
  isSubscribed: boolean;
  isUserDataLoaded: boolean;
};

interface UserActions {
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setIsSubscribed: (isSubscribed: boolean) => void;
  setIsUserDataLoaded: (isLoaded: boolean) => void;
  clearStore: () => void;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      name: "",
      email: "",
      isSubscribed: false,
      isUserDataLoaded: false,

      setName: (name: string) => set({ name }),
      setEmail: (email: string) => set({ email }),
      setIsSubscribed: (isSubscribed: boolean) => set({ isSubscribed }),
      setIsUserDataLoaded: (isLoaded: boolean) =>
        set({ isUserDataLoaded: isLoaded }),
      clearStore: () =>
        set({
          name: "",
          email: "",
          isSubscribed: false,
          isUserDataLoaded: false,
        }),
    }),
    {
      name: "user-store",
    },
  ),
);
