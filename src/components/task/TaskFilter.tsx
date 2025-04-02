import clsx from "clsx";
import React from "react";

import { usePageStore } from "@/hooks/usePageStore";

const options = [
  { id: "all", label: "All" },
  { id: "completed", label: "Completed" },
  { id: "incomplete", label: "Incomplete" },
];

function TaskFilter() {
  const taskFilter = usePageStore((state) => state.taskFilter);
  const setTaskFilter = usePageStore((state) => state.setTaskFilter);

  return (
    <div className="flex h-10 gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          className={clsx("rounded-full border px-3 py-2", {
            "pointer-events-none bg-neutral-200": taskFilter === option.id,
            "border-transparent hover:cursor-pointer hover:border-neutral-800 hover:bg-neutral-200":
              taskFilter !== option.id,
          })}
          onClick={() => setTaskFilter(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default TaskFilter;
