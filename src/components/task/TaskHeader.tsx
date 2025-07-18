import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { CalendarPlus, Eye, EyeOff, LoaderCircle } from "lucide-react";
import React from "react";

import { createTask } from "@/api/tasks";
import { usePageStore } from "@/hooks/usePageStore";
import { Task, TaskCreate } from "@/types/task";

interface TaskHeaderProps {
  tasks: Task[];
  dateStr: string;
  topRef: React.RefObject<HTMLDivElement | null>;
}

function TaskHeader({ tasks, dateStr, topRef }: TaskHeaderProps) {
  // Page store
  const showCompletedTasks = usePageStore(
    (state) => state.taskFilter !== "incomplete",
  );
  const setTaskFilter = usePageStore((state) => state.setTaskFilter);

  // Query client
  const queryClient = useQueryClient();

  // Handle the task filter change
  const completedTasks = tasks.filter((task) => task.is_completed);

  // Handle scroll to top
  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  // Handle the task creation
  const { mutate: mutateCreate, isPending: isCreating } = useMutation({
    mutationFn: (newTask: TaskCreate) => createTask(newTask),
    onSuccess: () => {
      // Invalidate the tasks query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["tasks", dateStr] });
      queryClient.invalidateQueries({
        queryKey: ["tasksCompletion", dateStr],
      });

      // Scroll to the top after a short delay
      setTimeout(() => {
        scrollToTop();
      }, 100);
    },
    onError: (error) => {
      console.error("Error updating task:", error);
    },
  });

  // Handle toggle completed tasks visibility
  const handleToggleCompletedTasks = () => {
    setTaskFilter(showCompletedTasks ? "incomplete" : "all");
  };

  // Handle the task creation button click
  const handleCreateTask = async () => {
    mutateCreate({
      date: dateStr,
    });
  };

  return (
    <>
      {/* Header */}
      <div className="task-header">
        {/* Left */}
        <div className="flex gap-2">
          {/* Toggle completed tasks button */}
          <button
            className="action-btn"
            onClick={handleToggleCompletedTasks}
            title={
              showCompletedTasks
                ? "Hide completed tasks"
                : "Show completed tasks"
            }
          >
            {showCompletedTasks ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>

        {/* Middle: Progress Bar */}
        {tasks && tasks.length > 0 && (
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className={clsx("progress-fill", {
                  completed: completedTasks.length === tasks.length,
                  "in-progress":
                    completedTasks.length > 0 &&
                    completedTasks.length < tasks.length,
                })}
                style={{
                  width: `${(completedTasks.length / tasks.length) * 100}%`,
                }}
              />
              {completedTasks.length === 0 ? (
                <span className="progress-text zero-progress">
                  {completedTasks.length}/{tasks.length}
                </span>
              ) : (
                <span
                  className="progress-text with-progress"
                  style={{
                    width: `${(completedTasks.length / tasks.length) * 100}%`,
                  }}
                >
                  {completedTasks.length}/{tasks.length}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Right: Create task buttons */}
        <div className="flex gap-2">
          {isCreating ? (
            <div className="spinning-btn">
              <LoaderCircle size={20} />
            </div>
          ) : (
            <button className="action-btn" onClick={handleCreateTask}>
              <CalendarPlus size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Ref for the top */}
      <div ref={topRef} className="invisible h-0" />
    </>
  );
}

export default TaskHeader;
