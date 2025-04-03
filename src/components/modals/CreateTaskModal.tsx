import { Button, Dialog, DialogPanel } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { CalendarPlus, LoaderCircle, Save } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { createTask } from "@/api/tasks";
import IconButton from "@/components/elements/IconButton";

function CreateTaskModal({ dateStr }: { dateStr: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [repeatDays, setRepeatDays] = useState(1);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const queryClient = useQueryClient();

  // Reset the input fields when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setNote("");
    }
  }, [isOpen]);

  // Handle the modal open and close
  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  // Handle the note textarea change
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Resize the textarea based on the content
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }

    setNote(e.target.value);
  };

  // Handle the task creation
  const { mutate: mutateCreate, isPending: isCreating } = useMutation({
    mutationFn: (taskId: number) => createTask(taskId),
    onSuccess: () => {
      // Invalidate the tasks query to refresh the data
      close();
      queryClient.invalidateQueries({ queryKey: ["tasks", dateStr] });
    },
    onError: (error) => {
      console.error("Error updating task:", error);
    },
  });

  // Handle the task creation button click
  const handleCreateTask = async () => {
    mutateCreate({
      date: dateStr,
      title: title,
      note: note,
      repeatable_days: repeatDays,
    });
  };

  return (
    <>
      <div className="relative inline-block">
        <Button
          onClick={open}
          className={clsx(
            "peer fixed right-8 bottom-8 z-10 rounded-full border p-2 hover:cursor-pointer hover:border-neutral-800 hover:bg-neutral-200",
            {
              "border-neutral-800 bg-neutral-200": isOpen,
              "border-transparent": !isOpen,
            },
          )}
        >
          <CalendarPlus />
        </Button>
        <div className="pointer-events-none absolute -top-18 -right-2 z-10 rounded bg-neutral-400 px-2 py-1 text-sm whitespace-nowrap opacity-0 transition-opacity delay-300 duration-150 peer-hover:opacity-100">
          Create
        </div>
      </div>

      <Dialog open={isOpen} as="div" className="relative z-10" onClose={close}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto backdrop-blur-xs">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl border-2 bg-neutral-100 p-4"
            >
              <input
                className="w-full truncate overflow-hidden border-b pb-2 text-lg font-semibold whitespace-nowrap outline-none"
                placeholder="Task name"
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
              <div className="border-t pt-2">
                <label htmlFor="repeat-days" className="block font-medium">
                  Repeat for:{" "}
                  <span className="font-normal">
                    {repeatDays}{" "}
                    {repeatDays === 1 ? "day (current day)" : "days"}
                  </span>
                </label>
                <input
                  id="repeat-days"
                  type="range"
                  min={1}
                  max={30}
                  value={repeatDays}
                  onChange={(e) => setRepeatDays(Number(e.target.value))}
                  className="mt-2 h-2 w-full appearance-none rounded-full [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-neutral-700 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neutral-700"
                  style={{
                    background: `linear-gradient(to right, #a3a3a3 ${(repeatDays - 1) * (100 / 29)}%, #e5e5e5 ${(repeatDays - 1) * (100 / 29)}%)`,
                  }}
                />
              </div>
              {isCreating ? (
                <div className="flex justify-center">
                  <div className="loading-btn">
                    <LoaderCircle />
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex justify-end">
                  <IconButton
                    buttonClassName="action-btn"
                    onClick={handleCreateTask}
                    icon={<Save />}
                    tooltipText="Save"
                    tooltipPosition="top-2 right-12"
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

export default CreateTaskModal;
