import { create } from "zustand";

type PageType = "auth" | "calendar" | "today" | "daily" | "notes" | "user";

type PageState = {
  page: PageType; // current page of the app
  calendarDate: Date; // date for the calendar
  dailyTab: "tasks" | "journal"; // tab for daily page
  taskFilter: string; // filter for tasks (e.g., "all", "completed", "incomplete")
  userTab: "subscription" | "support" | "password"; // tab for user page
  isModalOpen: boolean; // state for modal visibility

  setPage: (page: PageType) => void;
  setCalendarDate: (date: Date) => void;
  setDailyTab: (tab: "tasks" | "journal") => void;
  setTaskFilter: (filter: string) => void;
  setUserTab: (tab: "subscription" | "support" | "password") => void;
  setIsModalOpen: (isOpen: boolean) => void;
};

export const usePageStore = create<PageState>((set) => ({
  page: "calendar",
  calendarDate: new Date(),
  dailyTab: "tasks",
  taskFilter: "all",
  userTab: "subscription",
  isModalOpen: false,

  setPage: (page: PageType) => set({ page: page }),
  setCalendarDate: (date: Date) => set({ calendarDate: date }),
  setDailyTab: (tab: "tasks" | "journal") => set({ dailyTab: tab }),
  setTaskFilter: (filter: string) => set({ taskFilter: filter }),
  setUserTab: (tab: "subscription" | "support" | "password") =>
    set({ userTab: tab }),
  setIsModalOpen: (isOpen: boolean) => set({ isModalOpen: isOpen }),
}));
