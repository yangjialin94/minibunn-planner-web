"use client";

import clsx from "clsx";
import { addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

import Journal from "@/components/task/Journal";
import Tasks from "@/components/task/Tasks";
import { usePageStore } from "@/hooks/usePageStore";
import { formatDateLocalNoTime, parseLocalDate } from "@/utils/date";

interface DailyHeaderProps {
  dateStr: string;
  dailyTab: "tasks" | "journal";
  setDailyTab: (tab: "tasks" | "journal") => void;
}

function DailyHeader({ dateStr, dailyTab, setDailyTab }: DailyHeaderProps) {
  const router = useRouter();

  const date = parseLocalDate(dateStr);

  const handleTabChange = (tab: "tasks" | "journal") => {
    setDailyTab(tab);
  };

  const handleClickPrev = () => {
    router.push(`/calendar/${formatDateLocalNoTime(subDays(date, 1))}`);
  };

  const handleClickNext = () => {
    router.push(`/calendar/${formatDateLocalNoTime(addDays(date, 1))}`);
  };

  return (
    <div className="daily-header">
      <p className="text-lg font-bold">{dateStr}</p>
      <div className="flex items-center gap-2">
        <button
          className={clsx("daily-tab-btn", {
            selected: dailyTab === "tasks",
          })}
          onClick={() => handleTabChange("tasks")}
        >
          Tasks
        </button>
        <button
          className={clsx("daily-tab-btn", {
            selected: dailyTab === "journal",
          })}
          onClick={() => handleTabChange("journal")}
        >
          Journal
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button className="daily-arrow-btn" onClick={handleClickPrev}>
          <ChevronLeft />
        </button>
        <button className="daily-arrow-btn" onClick={handleClickNext}>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

function DailyPage() {
  const { date } = useParams();
  const setPage = usePageStore((state) => state.setPage);
  const dailyTab = usePageStore((state) => state.dailyTab);
  const setDailyTab = usePageStore((state) => state.setDailyTab);

  const today = formatDateLocalNoTime(new Date());
  const dateStr = date ? (Array.isArray(date) ? date[0] : date) : today;

  useEffect(() => {
    if (dateStr === today) {
      setPage("today");
    } else {
      setPage("daily");
    }
  }, [dateStr, setPage, today]);

  if (!date) {
    return <div>Error: Date parameter is missing.</div>;
  }

  return (
    <div className="scrollable-content">
      <DailyHeader
        dateStr={dateStr}
        dailyTab={dailyTab}
        setDailyTab={setDailyTab}
      />

      <div className="flex-1 overflow-y-auto">
        {dailyTab === "tasks" ? (
          <Tasks dateStr={dateStr} />
        ) : (
          <Journal dateStr={dateStr} />
        )}
      </div>
    </div>
  );
}

export default DailyPage;
