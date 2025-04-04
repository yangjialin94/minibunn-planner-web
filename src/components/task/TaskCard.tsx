import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Check, LoaderCircle, Trash2, Undo2 } from "lucide-react";
import React from "react";

import { deleteTask, updateTask } from "@/api/tasks";
import IconButton from "@/components/elements/IconButton";
import EditTaskModal from "@/components/modals/EditTaskModal";
import { Task } from "@/types/task";

function TaskCard({ task }: { task: Task }) {
  const queryClient = useQueryClient();

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
      className={clsx(
        "relative flex h-60 w-60 flex-col rounded-xl border border-neutral-800 p-4",
        {
          "bg-neutral-100": !task.is_completed,
          "bg-neutral-200": task.is_completed,
        },
      )}
    >
      <div className="pb-2">
        <p className="truncate overflow-hidden text-lg font-semibold">
          {task.title}
        </p>
      </div>

      <div className="flex-1 overflow-auto border-t py-2">
        <p className="h-full w-full flex-1 whitespace-pre-wrap">{task.note}</p>
      </div>

      {isUpdating || isDeleting ? (
        <div className="flex justify-center">
          <div className="loading-btn">
            <LoaderCircle />
          </div>
        </div>
      ) : (
        <div className="flex justify-between">
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
  );
}

export default TaskCard;
