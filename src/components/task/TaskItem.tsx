import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Menu, Transition } from "@headlessui/react"; // Import Menu and Transition from Headless UI
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { addDays } from "date-fns";
import {
  Check,
  GripVertical,
  Layers2,
  LoaderCircle,
  MoreVertical,
  SquareArrowRight,
  Trash2,
  Undo2,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { createTask, deleteTask, updateTask } from "@/api/tasks";
import { useDebounce } from "@/hooks/useDebounce";
import { usePageStore } from "@/hooks/usePageStore";
import { Task, TaskCreate } from "@/types/task";
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
  const itemRef = useRef<HTMLDivElement>(null);
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);
  const noteTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Page store
  const isModalOpen = usePageStore((state) => state.isModalOpen);

  // Handle the task note update
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  // Combine the refs
  const setCombinedRef = useCallback(
    (node: HTMLDivElement | null) => {
      setNodeRef(node);
      itemRef.current = node;
    },
    [setNodeRef],
  );

  // Query client
  const queryClient = useQueryClient();

  // Style for the sortable item
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    pointerEvents: isModalOpen ? "none" : "auto",
  };

  // Dates
  const dateStr = task.date;
  const nextDate = parseLocalDate(task.date); // Date
  const nextDateStr = formatDateLocalNoTime(addDays(nextDate, 1)); // String

  // Resize the title textarea based on the content
  const resizeTitleTextarea = () => {
    const el = titleTextareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + 2 + "px";
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
    resizeTitleTextarea();
    resizeNoteTextarea();
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
      queryClient.invalidateQueries({
        queryKey: ["tasksCompletion", task.date],
      });
    },
    onError: (error) => {
      console.error("Error updating task status:", error);
    },
  });

  // Handle the task creation
  const { mutate: mutateCreate } = useMutation({
    mutationFn: (newTask: TaskCreate) => createTask(newTask),
    onSuccess: () => {
      // Invalidate the tasks query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["tasks", dateStr] });
    },
    onError: (error) => {
      console.error("Error duplicating task:", error);
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
      queryClient.invalidateQueries({
        queryKey: ["tasksCompletion", task.date],
      });
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

  // Handle the task duplication button click
  const handleDuplicateTask = async () => {
    mutateCreate({
      date: nextDateStr,
      title: title,
      note: note,
    });
  };

  // Handle the task move to next day
  const handleMoveTask = async () => {
    mutateMove({ taskId: task.id, date: nextDateStr });
  };

  // Handle the task deletion
  const handleDeleteTask = async () => {
    mutateDelete(task.id);
  };

  return (
    <div
      ref={setCombinedRef}
      style={style}
      className="group relative cursor-default"
    >
      {/* Task item */}
      <div
        className={clsx(
          "relative flex items-start rounded-xl border border-neutral-300 p-2 hover:ring",
          {
            "bg-white": !task.is_completed,
            "bg-neutral-300": task.is_completed,
          },
        )}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className={clsx("relative mr-1 cursor-grab", {
            "action-btn": !task.is_completed,
            "reverse-action-btn": task.is_completed,
          })}
        >
          <GripVertical size={20} />
        </button>

        {/* Task inputs */}
        <div className="flex flex-1 flex-col gap-2">
          <textarea
            ref={titleTextareaRef}
            className={clsx(
              "w-full resize-none border-b pt-1 pb-2 text-base font-semibold outline-none",
              {
                "border-neutral-300": !task.is_completed,
                "border-white": task.is_completed,
              },
            )}
            placeholder="Title"
            onChange={handleUpdateTitle}
            value={title}
            rows={1}
            disabled={task.is_completed}
          />

          <textarea
            ref={noteTextareaRef}
            className="w-full resize-none pb-2 outline-none"
            placeholder="Note"
            onChange={handleUpdateNote}
            value={note}
            rows={1}
            disabled={task.is_completed}
          />
        </div>

        {/* Task action menu */}
        {isUpdating || isDeleting || isMoving ? (
          <div className="flex justify-center pt-2">
            <div className="spinning-btn">
              <LoaderCircle size={20} />
            </div>
          </div>
        ) : (
          <Menu as="div" className="relative">
            {/* Menu Toggle Button */}
            <Menu.Button
              className={({ open }) =>
                clsx(
                  {
                    "action-btn": !task.is_completed,
                    "reverse-action-btn": task.is_completed,
                  },
                  {
                    "bg-neutral-300": open && !task.is_completed,
                    "bg-white": open && task.is_completed,
                  },
                )
              }
            >
              <MoreVertical size={20} />
            </Menu.Button>

            {/* Dropdown Panel */}
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="ring-opacity-5 absolute right-0 z-50 mt-2 w-52 origin-top-right rounded-xl bg-white shadow-2xl focus:outline-none">
                <div className="p-1">
                  {!task.is_completed ? (
                    <Menu.Item key={`complete-${id}`}>
                      {() => (
                        <button
                          className="menu-btn green"
                          onClick={handleCompleteTask}
                        >
                          <Check size={20} />
                          Complete
                        </button>
                      )}
                    </Menu.Item>
                  ) : (
                    <Menu.Item key={`incomplete-${id}`}>
                      {() => (
                        <button
                          className="menu-btn"
                          onClick={handleCompleteTask}
                        >
                          <Undo2 size={20} />
                          Incomplete
                        </button>
                      )}
                    </Menu.Item>
                  )}

                  <Menu.Item key={`duplicate-${id}`}>
                    {() => (
                      <button
                        className="menu-btn"
                        onClick={handleDuplicateTask}
                      >
                        <Layers2 size={20} />
                        Duplicate to next day
                      </button>
                    )}
                  </Menu.Item>

                  {!task.is_completed && (
                    <Menu.Item key={`move-${id}`}>
                      {() => (
                        <button className="menu-btn" onClick={handleMoveTask}>
                          <SquareArrowRight size={20} />
                          Move to next day
                        </button>
                      )}
                    </Menu.Item>
                  )}

                  <Menu.Item key={`trash-${id}`}>
                    {() => (
                      <button
                        className="menu-btn red"
                        onClick={handleDeleteTask}
                      >
                        <Trash2 size={20} />
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>
    </div>
  );
}

export default TaskItem;
