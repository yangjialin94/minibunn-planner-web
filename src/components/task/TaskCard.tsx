import clsx from "clsx";
import { Check, Pencil } from "lucide-react";
import React from "react";

import { Task } from "@/types/task";

function TaskCard({ task }: { task: Task }) {
  return (
    <div
      className={clsx(
        "relative flex h-60 w-60 flex-col rounded-xl border border-neutral-800 p-4",
        {
          "bg-neutral-200": task.isCompleted,
        },
      )}
    >
      <div className="pb-2">
        <p className="truncate overflow-hidden text-lg font-semibold whitespace-nowrap">
          {task.name}
        </p>
      </div>

      <div className="flex-1 border-t py-2">
        <p className="line-clamp-4">{task.note}</p>
      </div>

      {!task.isCompleted && (
        <div className="flex justify-between">
          <button className="action-btn">
            <Pencil />
          </button>
          <button className="action-btn">
            <Check />
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
