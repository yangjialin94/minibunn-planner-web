import { create } from "zustand";

import { formatDateLocalNoTime } from "@/lib/dateUtils";

type PageType = "calendar" | "journal" | "daily";

type PageState = {
  currentPage: PageType; // current page of the app
  taskDateStr: string; // date (yyyy-mm-dd) user last visited
  taskFilter: string; // filter for tasks (e.g., "all", "completed", "incomplete")

  setPage: (page: PageType) => void;
  setTaskDate: (dateStr: string) => void;
  setTaskFilter: (filter: string) => void;
};

export const usePageStore = create<PageState>((set) => ({
  currentPage: "calendar",
  taskDateStr: formatDateLocalNoTime(new Date()),
  taskFilter: "all",

  setPage: (page: PageType) => set({ currentPage: page }),
  setTaskDate: (dateStr: string) => set({ taskDateStr: dateStr }),
  setTaskFilter: (filter: string) => set({ taskFilter: filter }),
}));
