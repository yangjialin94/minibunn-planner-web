"use client";

import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { fetchOrCreateJournalByDate } from "@/api/journals";
import { fetchTasksInRange } from "@/api/tasks";
import { updateTask } from "@/api/tasks";
import CreateTaskModal from "@/components/modals/CreateTaskModal";
import TaskCard from "@/components/task/TaskCard";
import TaskFilter from "@/components/task/TaskFilter";
import { usePageStore } from "@/hooks/usePageStore";
import { formatDateLocalNoTime, parseLocalDate } from "@/lib/dateUtils";
import { Task } from "@/types/task";

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

function SortableItem({ id, task }: { id: number; task: Task }) {
  const isModalOpen = usePageStore((state) => state.isModalOpen);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    pointerEvents: isModalOpen ? "none" : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!isModalOpen ? { ...attributes, ...listeners } : {})}
      className="cursor-grab"
    >
      <TaskCard task={task} />
    </div>
  );
}

function Tasks({ dateStr }: { dateStr: string }) {
  const taskFilter = usePageStore((state) => state.taskFilter);
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks", dateStr],
    queryFn: () => fetchTasksInRange(dateStr, dateStr),
  });
  const [orderedTasks, setOrderedTasks] = useState<Task[]>([]);
  const queryClient = useQueryClient();

  // Handle the task order update
  const { mutate: mutateUpdateOrder, isPending: isUpdating } = useMutation({
    mutationFn: ({ taskId, order }: { taskId: number; order: number }) =>
      updateTask(taskId, { order: order }),
    onSuccess: () => {
      // Invalidate the tasks query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["tasks", dateStr] });
    },
    onError: (error) => {
      console.error("Error updating task order:", error);
    },
  });

  // Load tasks into state
  useEffect(() => {
    if (data) {
      setOrderedTasks(data);
    }
  }, [data]);

  // Update task order
  const handleDragEnd = (event: DragEndEvent) => {
    if (isUpdating) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedTasks.findIndex((item) => item.id === active.id);
    const newIndex = orderedTasks.findIndex((item) => item.id === over.id);
    const newOrder = arrayMove(orderedTasks, oldIndex, newIndex);
    setOrderedTasks(newOrder);

    // Update the order in the backend
    mutateUpdateOrder({ taskId: Number(active.id), order: newIndex + 1 });
  };

  // Handle loading and error states
  if (isLoading) return <div className="p-4">Loading tasks...</div>;
  if (error) {
    console.error(error);
    return <div className="p-4">Error loading tasks.</div>;
  }

  return (
    <>
      {/* filters and Progress */}
      <div className="flex flex-wrap-reverse items-center justify-between gap-4 p-4">
        <TaskFilter />
        {orderedTasks && (
          <p className="font-medium">
            Progress: {orderedTasks.filter((task) => task.is_completed).length}{" "}
            / {orderedTasks.length}
          </p>
        )}
      </div>

      {/* Task List */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={orderedTasks} strategy={rectSortingStrategy}>
          <div className="flex flex-wrap gap-4 p-4">
            {orderedTasks.map((task) => {
              if (taskFilter === "completed" && !task.is_completed) return null;
              if (taskFilter === "incomplete" && task.is_completed) return null;
              return <SortableItem key={task.id} id={task.id} task={task} />;
            })}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add Task Button */}
      <CreateTaskModal dateStr={dateStr} />
    </>
  );
}

function Journal({ dateStr }: { dateStr: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["journals", dateStr],
    queryFn: () => fetchOrCreateJournalByDate(dateStr),
  });

  if (isLoading) return <div className="p-4">Loading journal...</div>;

  if (error) {
    console.error(error);
    return <div className="p-4">Error loading journal.</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <input
        type="text"
        className="h-12 w-full border-b border-neutral-800 p-4 text-xl font-semibold outline-none"
        placeholder="Subject"
        onChange={(e) => console.log(e.target.value)}
        value={data?.subject ? data.subject : ""}
      />
      <textarea
        className="flex-1 resize-none p-4 outline-none"
        placeholder="Write your entry here..."
        onChange={(e) => console.log(e.target.value)}
        value={data?.entry ? data.entry : ""}
      />
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
