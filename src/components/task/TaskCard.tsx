import clsx from "clsx";
import { Check, X } from "lucide-react";
import React from "react";

import { Task } from "@/types/task";

function TaskCard({ task }: { task: Task }) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-neutral-800 p-4 hover:ring hover:ring-neutral-800",
        {
          "bg-neutral-200": task.isCompleted,
        },
      )}
    >
      <div className="pb-2">
        <p className="text-lg font-semibold">{task.name}</p>
      </div>

      <div className="border-t py-2">{task.note}</div>

      {!task.isCompleted && (
        <div className="flex justify-end">
          <button className="action-btn">
            <Check />
          </button>
          <button className="action-btn">
            <X />
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
