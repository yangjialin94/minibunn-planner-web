import { Button, Dialog, DialogPanel } from "@headlessui/react";
import clsx from "clsx";
import { Plus, Save } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

function CreateTaskModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [repeatDays, setRepeatDays] = useState(1);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset the input fields when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setName("");
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

  return (
    <>
      <Button
        onClick={open}
        className={clsx(
          "fixed right-8 bottom-8 z-10 rounded-full border p-2 hover:cursor-pointer hover:border-neutral-800 hover:bg-neutral-200",
          {
            "border-neutral-800 bg-neutral-200": isOpen,
            "border-transparent": !isOpen,
          },
        )}
      >
        <Plus />
      </Button>

      <Dialog open={isOpen} as="div" className="relative z-10" onClose={close}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl border bg-neutral-100 p-4"
            >
              <input
                className="w-full truncate overflow-hidden border-b pb-2 text-lg font-semibold whitespace-nowrap outline-none"
                placeholder="Task name"
                onChange={(e) => setName(e.target.value)}
                value={name}
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
              <div className="mt-4 flex justify-end">
                <Button className="action-btn" onClick={close}>
                  <Save />
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default CreateTaskModal;
