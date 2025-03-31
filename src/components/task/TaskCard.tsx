import clsx from "clsx";
import { Check, X } from "lucide-react";
import React, { useState } from "react";

import { Task } from "@/types/task";

function TaskCard({ task }: { task: Task }) {
  const [name, setName] = useState(task.name);
  const [note, setNote] = useState(task.note);

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
        <input
          className="truncate overflow-hidden text-lg font-semibold whitespace-nowrap outline-none"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>

      <div className="flex-1 border-t py-2">
        <textarea
          className="h-full w-full flex-1 resize-none outline-none"
          placeholder="Write your entry here..."
          onChange={(e) => setNote(e.target.value)}
          value={note}
        />
      </div>

      {!task.isCompleted && (
        <div className="flex justify-between">
          <button className="action-btn">
            <X />
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
