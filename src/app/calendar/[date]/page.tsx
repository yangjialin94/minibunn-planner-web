"use client";

import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { fetchTasksByDate } from "@/api/tasks";
import TaskCard from "@/components/task/TaskCard";
import TaskFilter from "@/components/task/TaskFilter";
import { usePageStore } from "@/hooks/usePageStore";
import { formatDateLocalNoTime, parseLocalDate } from "@/lib/dateUtils";

function DailyHeader({
  date,
  dailyTab,
  setDailyTab,
}: {
  date: Date;
  dailyTab: "tasks" | "journal";
  setDailyTab: (tab: "tasks" | "journal") => void;
}) {
  const router = useRouter();

  const formattedDate = formatDateLocalNoTime(date);

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
      <p className="text-lg font-bold">{formattedDate}</p>
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

function StatusBar({ dateStr }: { dateStr: string }) {
  return (
    <div className="flex justify-between p-4">
      <TaskFilter />
      <div>
        <span className="text-sm font-bold text-gray-500">
          [ Get daily completion status by date ({dateStr}): 1/3 ]
        </span>
      </div>
    </div>
  );
}

function Tasks({ dateStr }: { dateStr: string }) {
  const taskFilter = usePageStore((state) => state.taskFilter);
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks", dateStr],
    queryFn: () => fetchTasksByDate(dateStr),
  });

  if (isLoading) return <div className="p-4">Loading tasks...</div>;

  if (error) {
    console.error(error);
    return <div className="p-4">Error loading tasks.</div>;
  }

  return (
    <div className="flex flex-wrap gap-4 p-4">
      {data?.tasks.map((task) => {
        if (taskFilter === "completed" && !task.isCompleted) return null;
        if (taskFilter === "incomplete" && task.isCompleted) return null;
        return <TaskCard key={task.id} task={task} />;
      })}
    </div>
  );
}

function Journal({ dateStr }: { dateStr: string }) {
  // TODO: Fetch journal entry by date
  console.log("Journal", dateStr);

  return (
    <div className="flex h-[calc(100vh-152px)] flex-col gap-4 p-4">
      <input
        type="text"
        className="h-12 w-full border-b border-neutral-800 p-4 text-xl font-semibold outline-none"
        placeholder="Subject"
      />
      <textarea
        className="flex-1 resize-none p-4 outline-none"
        placeholder="Write your entry here..."
      ></textarea>
    </div>
  );
}

function DailyPage() {
  const { date } = useParams();
  const setPage = usePageStore((state) => state.setPage);
  const dailyTab = usePageStore((state) => state.dailyTab);
  const setDailyTab = usePageStore((state) => state.setDailyTab);

  const today = formatDateLocalNoTime(new Date());

  const dateStr = date
    ? Array.isArray(date)
      ? date[0]
      : date
    : formatDateLocalNoTime(new Date());

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

  const localDate = parseLocalDate(dateStr);

  return (
    <div className="scrollable-content">
      <DailyHeader
        date={localDate}
        dailyTab={dailyTab}
        setDailyTab={setDailyTab}
      />

      {dailyTab === "tasks" ? (
        <>
          <StatusBar dateStr={dateStr} />
          <Tasks dateStr={dateStr} />
        </>
      ) : (
        <Journal dateStr={dateStr} />
      )}
    </div>
  );
}

export default DailyPage;
