import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { addDays } from "date-fns";
import {
  Check,
  GripVertical,
  LoaderCircle,
  SquareArrowRight,
  Trash2,
  Undo2,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { deleteTask, updateTask } from "@/api/tasks";
import IconButton from "@/components/elements/IconButton";
import { useDebounce } from "@/hooks/useDebounce";
import { usePageStore } from "@/hooks/usePageStore";
import { Task } from "@/types/task";
import { formatDateLocalNoTime, parseLocalDate } from "@/utils/date";

/**
 * Sortable Item for Tasks
 */
function TaskItem({ id, task }: { id: number; task: Task }) {
  // Title
  const [title, setTitle] = useState(task.title);
  const debouncedTitle = useDebounce(title, 300);

  // Note
  const [note, setNote] = useState(task.note);
  const debouncedNote = useDebounce(note, 300);

  // Refs
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);
  const noteTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Page store
  const isModalOpen = usePageStore((state) => state.isModalOpen);

  // Handle the task note update
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  // Query client
  const queryClient = useQueryClient();

  // Style for the sortable item
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    pointerEvents: isModalOpen ? "none" : "auto",
  };

  // Resize the title textarea based on the content
  const resizeTitleTextarea = () => {
    const el = titleTextareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  };

  // Resize the note textarea based on the content
  const resizeNoteTextarea = () => {
    const el = noteTextareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  };

  // Reset the textarea height
  useEffect(() => {
    setTimeout(() => {
      resizeTitleTextarea();
      resizeNoteTextarea();
    }, 0);
  }, [task]);

  // Handle the task update
  const { mutate: mutateUpdate } = useMutation({
    mutationFn: (taskId: number) =>
      updateTask(taskId, { title: title, note: note }),
    onSuccess: () => {
      // Invalidate the tasks query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["tasks", task.date] });
    },
    onError: (error) => {
      console.error("Error updating task:", error);
    },
  });

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

  // Handle the task date update
  const { mutate: mutateMove, isPending: isMoving } = useMutation({
    mutationFn: ({ taskId, date }: { taskId: number; date: string }) =>
      updateTask(taskId, { date: date }),
    onSuccess: () => {
      // Invalidate the tasks query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["tasks", task.date] });
    },
    onError: (error) => {
      console.error("Error updating task:", error);
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

  // Handle the task update - API call
  useEffect(() => {
    if (debouncedTitle !== task.title || debouncedNote !== task.note) {
      mutateUpdate(task.id);
    }
  }, [
    debouncedTitle,
    task.id,
    task.title,
    task.note,
    mutateUpdate,
    debouncedNote,
  ]);

  // Handle the task title update - local state
  const handleUpdateTitle = async (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTitle(e.target.value);
    resizeTitleTextarea();
  };

  // Handle the task note update
  const handleUpdateNote = async (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setNote(e.target.value);
    resizeNoteTextarea();
  };

  // Handle the task completion toggle
  const handleCompleteTask = async () => {
    mutateUpdateComplete(task.id);
  };

  // Handle the task move to next day
  const handleMoveTask = async () => {
    const oldDate = parseLocalDate(task.date); // Date
    const newDateStr = formatDateLocalNoTime(addDays(oldDate, 1)); // String
    console.log("Moving task to date:", newDateStr);

    mutateMove({ taskId: task.id, date: newDateStr });
  };

  // Handle the task deletion
  const handleDeleteTask = async () => {
    mutateDelete(task.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative cursor-default"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="peer absolute top-1/2 -left-4 z-10 hidden -translate-y-1/2 transform group-hover:block"
      >
        <div className="relative">
          <button className="peer cursor-grab rounded-full border bg-neutral-100 p-2 hover:border-2 hover:bg-neutral-300">
            <GripVertical size={16} />
          </button>
          <div className="tool-tip top">Drag</div>
        </div>
      </div>

      {/* Task item */}
      <div
        className={clsx(
          "relative flex flex-col rounded-xl border border-neutral-800 p-4 peer-hover:border-2 hover:border-2",
          {
            "bg-neutral-100": !task.is_completed,
            "bg-neutral-200": task.is_completed,
          },
        )}
      >
        {/* Task inputs */}
        <div className="flex flex-col gap-4 px-4">
          <textarea
            ref={titleTextareaRef}
            className="w-full resize-none border-b pb-4 text-lg font-semibold break-all outline-none"
            placeholder="Title"
            onChange={handleUpdateTitle}
            value={title}
            rows={1}
            disabled={task.is_completed}
          />

          <textarea
            ref={noteTextareaRef}
            className="w-full resize-none break-all outline-none"
            placeholder="Note"
            onChange={handleUpdateNote}
            value={note}
            rows={1}
            disabled={task.is_completed}
          />
        </div>

        {/* Task actions */}
        {isUpdating || isDeleting || isMoving ? (
          <div className="flex justify-center pt-2">
            <div className="loading-btn">
              <LoaderCircle />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-2">
            <IconButton
              buttonClassName={clsx({
                "action-btn": !task.is_completed,
                "reverse-action-btn": task.is_completed,
              })}
              onClick={handleDeleteTask}
              icon={<Trash2 />}
              tooltipText="Delete"
            />
            {task.repeatable_days && (
              <div className="relative inline-block">
                <p className="peer font-medium">
                  Repeated ID:{" "}
                  <span className="font-normal">
                    {task?.repeatable_id?.toString().slice(-4)}
                  </span>
                </p>
                <p className="tool-tip top">
                  Changes will affect all future repeated tasks
                </p>
              </div>
            )}
            <div className="flex items-center">
              {!task.repeatable_id &&
                !task.repeatable_days &&
                !task.is_completed && (
                  <IconButton
                    buttonClassName="action-btn"
                    onClick={handleMoveTask}
                    icon={<SquareArrowRight />}
                    tooltipText="Move to next day"
                  />
                )}
              {!task.is_completed ? (
                <IconButton
                  buttonClassName="action-btn"
                  onClick={handleCompleteTask}
                  icon={<Check />}
                  tooltipText="Complete"
                />
              ) : (
                <IconButton
                  buttonClassName="reverse-action-btn"
                  onClick={handleCompleteTask}
                  icon={<Undo2 />}
                  tooltipText="Incomplete"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskItem;
