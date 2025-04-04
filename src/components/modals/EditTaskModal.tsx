import { Button, Dialog, DialogPanel } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { LoaderCircle, Save, SquarePen, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { deleteTask, updateTask } from "@/api/tasks";
import IconButton from "@/components/elements/IconButton";
import { Task } from "@/types/task";

function EditTaskModal({ task }: { task: Task }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const queryClient = useQueryClient();

  // Handle the task deletion
  const { mutate: mutateDelete, isPending: isDeleting } = useMutation({
    mutationFn: (taskId: number) => deleteTask(taskId),
    onSuccess: () => {
      // Invalidate the tasks query to refresh the data
      close();
      queryClient.invalidateQueries({ queryKey: ["tasks", task.date] });
    },
    onError: (error) => {
      console.error("Error updating task:", error);
    },
  });

  // Handle the task update
  const { mutate: mutateUpdate, isPending: isUpdating } = useMutation({
    mutationFn: (taskId: number) =>
      updateTask(taskId, { title: title, note: note }),
    onSuccess: () => {
      // Invalidate the tasks query to refresh the data
      close();
      queryClient.invalidateQueries({ queryKey: ["tasks", task.date] });
    },
    onError: (error) => {
      console.error("Error updating task:", error);
    },
  });

  // Resize the textarea based on the content
  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  };

  // Reset the input fields when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setTitle(task.title);
      setNote(task.note);

      setTimeout(() => {
        resizeTextarea();
      }, 0);
    }
  }, [isOpen, task]);

  // Handle the note textarea change
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
    resizeTextarea();
  };

  // Handle the modal open and close
  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  // Handle the task update
  const handleUpdateTask = async () => {
    mutateUpdate(task.id);
  };

  // Handle the task deletion
  const handleDeleteTask = async () => {
    mutateDelete(task.id);
  };

  return (
    <>
      <div className="relative inline-block">
        <Button
          onPointerDown={(e: React.PointerEvent<HTMLButtonElement>) =>
            e.stopPropagation()
          }
          onClick={(e: React.PointerEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            open();
          }}
          className={clsx(
            "peer rounded-full border p-2 hover:cursor-pointer hover:border-neutral-800 hover:bg-neutral-200",
            {
              "border-neutral-800 bg-neutral-200": isOpen,
              "border-transparent": !isOpen,
            },
          )}
        >
          <SquarePen />
        </Button>
        <div className="pointer-events-none absolute -top-8 -right-3 z-10 rounded bg-neutral-400 px-2 py-1 text-sm whitespace-nowrap opacity-0 transition-opacity delay-300 duration-150 peer-hover:opacity-100">
          Update
        </div>
      </div>

      <Dialog open={isOpen} as="div" className="relative z-10" onClose={close}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto backdrop-blur-xs">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl border-2 bg-neutral-100 p-4"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <input
                className="w-full truncate overflow-hidden border-b pb-2 text-lg font-semibold whitespace-nowrap outline-none"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
              <textarea
                ref={textareaRef}
                className="mt-2 w-full resize-none outline-none"
                placeholder="Write your entry here..."
                onChange={handleNoteChange}
                value={note}
              />

              {isDeleting || isUpdating ? (
                <div className="flex justify-center">
                  <div className="loading-btn">
                    <LoaderCircle />
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex items-center justify-between">
                  <IconButton
                    buttonClassName="action-btn"
                    onClick={handleDeleteTask}
                    icon={<Trash2 />}
                    tooltipText="Delete"
                    tooltipPosition="-top-8 -right-2"
                  />
                  {task.repeatable_days && (
                    <div className="relative inline-block">
                      <p className="peer font-medium">Repeated</p>
                      <div className="pointer-events-none absolute -top-8 -right-35 z-10 rounded bg-neutral-400 px-2 py-1 text-sm whitespace-nowrap opacity-0 transition-opacity delay-300 duration-150 peer-hover:opacity-100">
                        <p>
                          Changes will affect all repeated tasks starting today
                        </p>
                      </div>
                    </div>
                  )}
                  <IconButton
                    buttonClassName="action-btn"
                    onClick={handleUpdateTask}
                    icon={<Save />}
                    tooltipText="Save"
                    tooltipPosition="-top-8 -right-1"
                  />
                </div>
              )}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default EditTaskModal;
