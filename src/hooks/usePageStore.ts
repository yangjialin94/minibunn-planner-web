import { create } from "zustand";

import { formatDateLocalNoTime } from "@/utils/date";

type PageType = "auth" | "calendar" | "today" | "daily" | "notes" | "user";

type PageState = {
  page: PageType; // current page of the app
  calendarDate: Date; // date for the calendar
  dailyTab: "tasks" | "journal"; // tab for daily page
  taskFilter: string; // filter for tasks (e.g., "all", "completed", "incomplete")
  userTab: "account" | "support"; // tab for user page
  isModalOpen: boolean; // state for modal visibility
  today: string; // current date in "YYYY-MM-DD" format

  setPage: (page: PageType) => void;
  setCalendarDate: (date: Date) => void;
  setDailyTab: (tab: "tasks" | "journal") => void;
  setTaskFilter: (filter: string) => void;
  setUserTab: (tab: "account" | "support") => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setToday: (date: string) => void;
};

export const usePageStore = create<PageState>((set) => {
  // Function to update the today at midnight
  const midnightUpdate = () => {
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0);

    // Calculate milliseconds until next midnight with 1000ms buffer
    const msUntilMidnight = nextMidnight.getTime() - now.getTime() + 1000;

    // Testing: Log for debugging
    // console.log("⏰ Scheduling midnight update in:", msUntilMidnight, "ms");
    // console.log("🕒 Current time:", now.toLocaleString());
    // console.log("🌙 Next midnight target:", nextMidnight.toLocaleString());

    // Set a timeout to update the today date at midnight
    setTimeout(() => {
      const newTodayStr = formatDateLocalNoTime(new Date());
      console.log("Updating today to:", newTodayStr);
      set({ today: newTodayStr });

      // Schedule the next midnight update
      midnightUpdate();
    }, msUntilMidnight);
  };

  // Start the midnight timer immediately on store creation
  midnightUpdate();

  return {
    page: "calendar",
    calendarDate: new Date(),
    dailyTab: "tasks",
    taskFilter: "all",
    userTab: "account",
    isModalOpen: false,
    today: formatDateLocalNoTime(new Date()),

    setPage: (page: PageType) => set({ page: page }),
    setCalendarDate: (date: Date) => set({ calendarDate: date }),
    setDailyTab: (tab: "tasks" | "journal") => set({ dailyTab: tab }),
    setTaskFilter: (filter: string) => set({ taskFilter: filter }),
    setUserTab: (tab: "account" | "support") => set({ userTab: tab }),
    setIsModalOpen: (isOpen: boolean) => set({ isModalOpen: isOpen }),
    setToday: (date: string) => set({ today: date }),
  };
});
