import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { CalendarPlus, LoaderCircle, SquareCheck } from "lucide-react";
import React from "react";

import { createTask } from "@/api/tasks";
import { usePageStore } from "@/hooks/usePageStore";
import { Task, TaskCreate } from "@/types/task";

interface TaskHeaderProps {
  tasks: Task[];
  dateStr: string;
  topRef: React.RefObject<HTMLDivElement | null>;
}

const options = [
  { id: "all", label: "All" },
  { id: "incomplete", label: "Active" },
  { id: "completed", label: "Completed" },
];

function TaskHeader({ tasks, dateStr, topRef }: TaskHeaderProps) {
  // Page store
  const taskFilter = usePageStore((state) => state.taskFilter);
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
          {/* Filter buttons */}
          {options.map((option) => (
            <button
              key={option.id}
              className={clsx("rounded-full px-3 py-2", {
                "pointer-events-none bg-neutral-300": taskFilter === option.id,
                "hover:cursor-pointer hover:bg-neutral-300":
                  taskFilter !== option.id,
              })}
              onClick={() => setTaskFilter(option.id)}
            >
              {option.label}
            </button>
          ))}

          {/* Progress */}
          {tasks && tasks.length > 0 && (
            <div
              className={clsx(
                "ml-0 flex items-center text-base sm:ml-8",
                { "text-green-600": completedTasks.length === tasks.length },
                { "text-red-600": completedTasks.length < tasks.length },
              )}
            >
              <SquareCheck className="mr-1" size={20} />
              {completedTasks.length}/{tasks.length}
            </div>
          )}
        </div>

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
