import { create } from "zustand";

type PageType = "calendar" | "streak" | "daily";

type PageState = {
  currentPage: PageType;
  setPage: (page: PageType) => void;
};

export const usePageStore = create<PageState>((set) => ({
  currentPage: "calendar",
  setPage: (page: PageType) => set({ currentPage: page }),
}));
