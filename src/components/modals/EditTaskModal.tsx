import { Button, Dialog, DialogPanel } from "@headlessui/react";
import clsx from "clsx";
import { Save, Settings, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { Task } from "@/types/task";

function EditTaskModal({ task }: { task: Task }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset the input fields when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setName(task.name);
      setNote(task.note);
    }
  }, [isOpen, task]);

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
          "rounded-full border p-2 hover:cursor-pointer hover:border-neutral-800 hover:bg-neutral-200",
          {
            "border-neutral-800 bg-neutral-200": isOpen,
            "border-transparent": !isOpen,
          },
        )}
      >
        <Settings />
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
              <p className="font-medium">Repeated</p>
              <div className="mt-4 flex justify-between">
                <Button className="action-btn" onClick={close}>
                  <Trash2 />
                </Button>
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

export default EditTaskModal;
