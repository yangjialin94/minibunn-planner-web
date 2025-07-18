"use client";

import clsx from "clsx";
import { addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

import Note from "@/components/note/Note";
import Tasks from "@/components/task/Tasks";
import { usePageStore } from "@/hooks/usePageStore";
import { useUserStore } from "@/hooks/useUserStore";
import {
  formatDateLocalNoTime,
  formatDateWithWeekday,
  parseLocalDate,
} from "@/utils/date";

interface DailyHeaderProps {
  dateStr: string;
  dailyTab: "tasks" | "note";
  setDailyTab: (tab: "tasks" | "note") => void;
}

/**
 * Premium Badge component
 */
const PremiumBadge = () => {
  return (
    <span className="ml-2 rounded-full border-2 border-yellow-400 bg-yellow-100 px-2 py-0.5 text-xs font-bold text-yellow-700 shadow-sm">
      VIP
    </span>
  );
};

/**
 * Daily Header
 */
function DailyHeader({ dateStr, dailyTab, setDailyTab }: DailyHeaderProps) {
  const router = useRouter();

  const date = parseLocalDate(dateStr);
  const headerDate = formatDateWithWeekday(dateStr);

  // Check if user is subscribed
  const isSubscribed = useUserStore((state) => state.isSubscribed);

  const handleTabChange = (tab: "tasks" | "note") => {
    setDailyTab(tab);
  };

  const handleClickPrev = () => {
    router.push(`/calendar/${formatDateLocalNoTime(subDays(date, 1))}`);
  };

  const handleClickNext = () => {
    router.push(`/calendar/${formatDateLocalNoTime(addDays(date, 1))}`);
  };

  return (
    <>
      {/* Header for larger screens */}
      <div className="hidden sm:block">
        <div className="daily-header relative">
          <h2 className="pl-2">{headerDate}</h2>
          <div className="absolute left-1/2 flex -translate-x-1/2 transform items-center gap-2">
            <button
              className={clsx("daily-tab-btn", {
                selected: dailyTab === "tasks",
              })}
              onClick={() => handleTabChange("tasks")}
            >
              Task
            </button>
            <button
              className={clsx("daily-tab-btn", {
                selected: dailyTab === "note",
              })}
              onClick={() => handleTabChange("note")}
            >
              <span className="flex items-center">
                Note
                {!isSubscribed && <PremiumBadge />}
              </span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="daily-arrow-btn" onClick={handleClickPrev}>
              <ChevronLeft size={20} />
            </button>
            <button className="daily-arrow-btn" onClick={handleClickNext}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Header for smaller screens */}
      <div className="block sm:hidden">
        <div className="flex flex-col">
          <div className="daily-header">
            <h2>{headerDate}</h2>
            <div className="flex items-center gap-2">
              <button className="daily-arrow-btn" onClick={handleClickPrev}>
                <ChevronLeft size={20} />
              </button>
              <button className="daily-arrow-btn" onClick={handleClickNext}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div className="daily-header-single">
            <div className="flex items-center gap-2">
              <button
                className={clsx("daily-tab-btn", {
                  selected: dailyTab === "tasks",
                })}
                onClick={() => handleTabChange("tasks")}
              >
                Task
              </button>
              <button
                className={clsx("daily-tab-btn", {
                  selected: dailyTab === "note",
                })}
                onClick={() => handleTabChange("note")}
              >
                <span className="flex items-center">
                  Note
                  {!isSubscribed && <PremiumBadge />}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Daily Page
 */
function DailyPage() {
  // Get the date from the URL
  const { date } = useParams();

  // Page state
  const setPage = usePageStore((state) => state.setPage);
  const dailyTab = usePageStore((state) => state.dailyTab);
  const setDailyTab = usePageStore((state) => state.setDailyTab);
  const today = usePageStore((state) => state.today);

  // Get the selected date or default to today
  const dateStr = date ? (Array.isArray(date) ? date[0] : date) : today;

  // Check if the selected date is today
  useEffect(() => {
    if (dateStr === today) {
      setPage("today");
    } else {
      setPage("daily");
    }
  }, [dateStr, setPage, today]);

  // Error handling
  if (!date) {
    return <div>Error: Date parameter is missing.</div>;
  }

  return (
    <>
      {/* Header */}
      <DailyHeader
        dateStr={dateStr}
        dailyTab={dailyTab}
        setDailyTab={setDailyTab}
      />

      {/* Content */}
      {dailyTab === "tasks" ? (
        <Tasks dateStr={dateStr} />
      ) : (
        <Note dateStr={dateStr} />
      )}
    </>
  );
}

export default DailyPage;
