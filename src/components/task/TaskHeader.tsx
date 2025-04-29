import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { CalendarPlus, LoaderCircle } from "lucide-react";
import React from "react";

import { createTask } from "@/api/tasks";
import IconButton from "@/components/elements/IconButton";
import { usePageStore } from "@/hooks/usePageStore";
import { Task, TaskCreate } from "@/types/task";

interface TaskHeaderProps {
  tasks: Task[];
  dateStr: string;
}

const options = [
  { id: "all", label: "All" },
  { id: "incomplete", label: "Active" },
  { id: "completed", label: "Completed" },
];

function TaskHeader({ tasks, dateStr }: TaskHeaderProps) {
  // Refs
  const topRef = React.useRef<HTMLDivElement | null>(null);

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
        {/* Filter buttons */}
        <div className="flex gap-1 lg:gap-2">
          {options.map((option) => (
            <button
              key={option.id}
              className={clsx("rounded-full border px-2 py-1 lg:px-3 lg:py-2", {
                "pointer-events-none bg-neutral-200": taskFilter === option.id,
                "border-transparent hover:cursor-pointer hover:border-neutral-800 hover:bg-neutral-200":
                  taskFilter !== option.id,
              })}
              onClick={() => setTaskFilter(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:transform">
          {tasks && (
            <p className="font-medium">
              {completedTasks.length}/{tasks.length}
            </p>
          )}
        </div>

        {/* Create task buttons */}
        <div className="flex gap-2">
          {isCreating ? (
            <div className="spinning-btn">
              <LoaderCircle />
            </div>
          ) : (
            <IconButton
              buttonClassName="action-btn"
              onClick={handleCreateTask}
              icon={<CalendarPlus />}
              tooltipText="Create"
            />
          )}
        </div>
      </div>

      {/* Ref for the top */}
      <div ref={topRef} className="invisible h-0" />
    </>
  );
}

export default TaskHeader;
