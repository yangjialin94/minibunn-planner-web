import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import clsx from "clsx";
import { Save, Settings, Trash2 } from "lucide-react";
import { useState } from "react";

function EditTaskModal() {
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

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
              <DialogTitle as="h2" className="text-xl font-semibold">
                Edit task
              </DialogTitle>
              <p className="mt-2">
                Your payment has been successfully submitted. We&apos;ve sent
                you an email with all of the details of your order.
              </p>
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
