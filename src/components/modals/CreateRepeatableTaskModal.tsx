import { Button, Dialog, DialogPanel } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { CalendarSync, LoaderCircle, Save, X } from "lucide-react";
import React, { useEffect, useState } from "react";

import { createTask } from "@/api/tasks";
import IconButton from "@/components/elements/IconButton";
import { usePageStore } from "@/hooks/usePageStore";
import { TaskCreate } from "@/types/task";

function CreateRepeatableTaskModal({ dateStr }: { dateStr: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [repeatDays, setRepeatDays] = useState(2);

  const setIsModalOpen = usePageStore((state) => state.setIsModalOpen);
  const queryClient = useQueryClient();

  // Reset the repeatable days when the modal opens
  useEffect(() => {
    if (isOpen) {
      setRepeatDays(2);
    }
  }, [isOpen]);

  // Handle the modal open and close
  function open() {
    setIsOpen(true);
    setIsModalOpen(true);
  }

  function close() {
    setIsOpen(false);
    setIsModalOpen(false);
  }

  // Handle the task creation
  const { mutate: mutateCreate, isPending: isCreating } = useMutation({
    mutationFn: (newTask: TaskCreate) => createTask(newTask),
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
      repeatable_days: repeatDays,
    });
  };

  return (
    <>
      <div className="relative">
        <Button
          onClick={open}
          className={clsx(
            "peer rounded-full border p-2 hover:cursor-pointer hover:border-neutral-800 hover:bg-neutral-200",
            {
              "border-neutral-800 bg-neutral-200": isOpen,
              "border-transparent": !isOpen,
            },
          )}
        >
          <CalendarSync />
        </Button>
        <div className="tool-tip top">Create Repeats</div>
      </div>

      <Dialog open={isOpen} as="div" className="relative z-10" onClose={close}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto backdrop-blur-xs">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl border-2 bg-neutral-100 p-4"
            >
              {/* Repeat slider */}
              <div>
                <label
                  htmlFor="repeat-days"
                  className="flex justify-between font-medium"
                >
                  Repeat for:{" "}
                  <span className="font-normal">{repeatDays} days</span>
                </label>
                <input
                  id="repeat-days"
                  type="range"
                  min={2}
                  max={10}
                  value={repeatDays}
                  onChange={(e) => setRepeatDays(Number(e.target.value))}
                  className="slider mt-2 h-2"
                  style={{
                    background: `linear-gradient(
                        to right, 
                        #a3a3a3 ${((repeatDays - 2) / (10 - 2)) * 100}%,
                        #e5e5e5 ${((repeatDays - 2) / (10 - 2)) * 100}%
                      )`,
                  }}
                />
              </div>

              {/* Buttons */}
              {isCreating ? (
                <div className="flex justify-center">
                  <div className="loading-btn">
                    <LoaderCircle />
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex justify-between">
                  <IconButton
                    buttonClassName="action-btn"
                    onClick={close}
                    icon={<X />}
                    tooltipText="Cancel"
                    placement="bottom"
                  />
                  <IconButton
                    buttonClassName="action-btn"
                    onClick={handleCreateTask}
                    icon={<Save />}
                    tooltipText="Save"
                    placement="bottom"
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

export default CreateRepeatableTaskModal;
