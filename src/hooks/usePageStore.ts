import { create } from "zustand";

import { formatDateLocalNoTime } from "@/utils/date";

type PageType = "auth" | "calendar" | "today" | "daily" | "backlogs" | "user";

type PageState = {
  page: PageType; // current page of the app
  calendarDate: Date; // date for the calendar
  dailyTab: "tasks" | "note"; // tab for daily page
  taskFilter: string; // filter for tasks (e.g., "all", "incomplete")
  userTab: "account" | "support"; // tab for user page
  isModalOpen: boolean; // state for modal visibility
  today: string; // current date in "YYYY-MM-DD" format
  backlogsFilter: string; // search term for backlogs
  isSidebarOpen: boolean; // sidebar visibility state

  setPage: (page: PageType) => void;
  setCalendarDate: (date: Date) => void;
  setDailyTab: (tab: "tasks" | "note") => void;
  setTaskFilter: (filter: string) => void;
  setUserTab: (tab: "account" | "support") => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setToday: (date: string) => void;
  setBacklogsFilter: (searchTerm: string) => void;
  switchSidebarOpen: (show?: boolean) => void;
};

export const usePageStore = create<PageState>((set) => {
  // Function to update today's date if it has changed
  const startDateCheckLoop = () => {
    // Skip if running on the server
    if (typeof window === "undefined") return;

    const checkDateChange = () => {
      const currentStr = formatDateLocalNoTime(new Date());
      const currentToday = usePageStore.getState().today;

      if (currentStr !== currentToday) {
        console.log("🟢 Detected date change, updating today to:", currentStr);
        usePageStore.getState().setToday(currentStr);
      }

      requestAnimationFrame(checkDateChange); // Schedule the next check
    };

    requestAnimationFrame(checkDateChange); // Start the loop
  };

  // Start the timeout to update today's date at midnight
  const scheduleMidnightUpdate = () => {
    // Skip if running on the server
    if (typeof window === "undefined") return;

    // Get current date and calculate next midnight
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0);

    // Calculate milliseconds until next midnight with 1000ms buffer
    const msUntilMidnight = nextMidnight.getTime() - now.getTime() + 1000;
    console.log("⏰ Scheduling midnight update in:", msUntilMidnight, "ms");

    // Set a timeout to update the today date at midnight
    setTimeout(() => {
      const newTodayStr = formatDateLocalNoTime(new Date());
      console.log("🌙 Midnight update: setting today to:", newTodayStr);
      set({ today: newTodayStr });

      // Schedule the next midnight update
      scheduleMidnightUpdate();
    }, msUntilMidnight);
  };

  // Initialize today's date in "YYYY-MM-DD" format
  const todayStr = formatDateLocalNoTime(new Date());

  // Start the midnight timer immediately on store creation
  startDateCheckLoop();
  scheduleMidnightUpdate();

  return {
    page: "calendar",
    calendarDate: new Date(),
    dailyTab: "tasks",
    taskFilter: "all",
    userTab: "account",
    isModalOpen: false,
    today: todayStr,
    backlogsFilter: "",
    isSidebarOpen: false,

    setPage: (page: PageType) => set({ page: page }),
    setCalendarDate: (date: Date) => set({ calendarDate: date }),
    setDailyTab: (tab: "tasks" | "note") => set({ dailyTab: tab }),
    setTaskFilter: (filter: string) => set({ taskFilter: filter }),
    setUserTab: (tab: "account" | "support") => set({ userTab: tab }),
    setIsModalOpen: (isOpen: boolean) => set({ isModalOpen: isOpen }),
    setToday: (date: string) => set({ today: date }),
    setBacklogsFilter: (searchTerm: string) =>
      set({ backlogsFilter: searchTerm }),
    switchSidebarOpen: (show?: boolean) =>
      set((state) => ({
        isSidebarOpen: typeof show === "boolean" ? show : !state.isSidebarOpen,
      })),
  };
});
