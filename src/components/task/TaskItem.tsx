import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Check, LoaderCircle, Trash2, Undo2 } from "lucide-react";
import React from "react";

import { deleteTask, updateTask } from "@/api/tasks";
import IconButton from "@/components/elements/IconButton";
import EditTaskModal from "@/components/modals/EditTaskModal";
import { usePageStore } from "@/hooks/usePageStore";
import { Task } from "@/types/task";

function TaskItem({ id, task }: { id: number; task: Task }) {
  const queryClient = useQueryClient();

  const isModalOpen = usePageStore((state) => state.isModalOpen);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    pointerEvents: isModalOpen ? "none" : "auto",
  };

  // Handle the task completion
  const { mutate: mutateUpdateComplete, isPending: isUpdating } = useMutation({
    mutationFn: (taskId: number) =>
      updateTask(taskId, { is_completed: !task.is_completed }),
    onSuccess: () => {
      // Invalidate the tasks query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["tasks", task.date] });
    },
    onError: (error) => {
      console.error("Error updating task status:", error);
    },
  });

  // Handle the task deletion
  const { mutate: mutateDelete, isPending: isDeleting } = useMutation({
    mutationFn: (taskId: number) => deleteTask(taskId),
    onSuccess: () => {
      // Invalidate the tasks query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["tasks", task.date] });
    },
    onError: (error) => {
      console.error("Error updating task:", error);
    },
  });

  // Handle the task completion toggle
  const handleCompleteTask = async () => {
    mutateUpdateComplete(task.id);
  };

  // Handle the task deletion
  const handleDeleteTask = async () => {
    mutateDelete(task.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!isModalOpen ? { ...attributes, ...listeners } : {})}
      className="cursor-grab"
    >
      <div
        className={clsx(
          "relative flex flex-col rounded-xl border border-neutral-800 p-4",
          {
            "bg-neutral-100": !task.is_completed,
            "bg-neutral-200": task.is_completed,
          },
        )}
      >
        <div className="max-w-full overflow-x-auto pb-3">
          <p className="overflow= text-lg font-semibold break-all">
            {task.title}
          </p>
        </div>

        <div className="flex-1 overflow-auto border-t py-3">
          <p className="w-full break-all whitespace-pre-wrap">{task.note}</p>
        </div>

        {isUpdating || isDeleting ? (
          <div className="flex justify-center pt-2">
            <div className="loading-btn">
              <LoaderCircle />
            </div>
          </div>
        ) : (
          <div className="flex justify-center gap-8 pt-2">
            {!task.is_completed ? (
              <>
                <EditTaskModal task={task} />
                <IconButton
                  buttonClassName="action-btn"
                  onClick={handleCompleteTask}
                  icon={<Check />}
                  tooltipText="Complete"
                  tooltipPosition="-top-8 -right-4"
                />
              </>
            ) : (
              <>
                <IconButton
                  buttonClassName="reverse-action-btn"
                  onClick={handleDeleteTask}
                  icon={<Trash2 />}
                  tooltipText="Delete"
                  tooltipPosition="-top-8 -right-2"
                />
                <IconButton
                  buttonClassName="reverse-action-btn"
                  onClick={handleCompleteTask}
                  icon={<Undo2 />}
                  tooltipText="Incomplete"
                  tooltipPosition="-top-8 -right-5"
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskItem;
