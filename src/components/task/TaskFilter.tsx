import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
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

  const selected =
    options.find((option) => option.id === taskFilter) || options[0];

  const setSelected = (option: { id: string; label: string }) => {
    setTaskFilter(option.id);
  };

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <div>
          <ListboxButton
            anchor="bottom"
            className="flex min-w-[200px] justify-between rounded-2xl border border-neutral-800 px-3 py-2 hover:bg-neutral-200"
          >
            <p className="font-semibold">Filter: {selected.label}</p>
            {open ? <ChevronUp /> : <ChevronDown />}
          </ListboxButton>
          <ListboxOptions
            transition
            className="absolute z-10 mt-2 w-[200px] rounded-2xl border border-neutral-800 bg-white p-2 hover:ring hover:ring-neutral-800"
          >
            {options.map((option) => (
              <ListboxOption
                key={option.label}
                value={option}
                className="group flex items-center gap-2 rounded-2xl px-2 py-1 hover:cursor-pointer hover:bg-neutral-200"
              >
                <Check className="invisible size-4 fill-white group-data-[selected]:visible" />
                <div className="text-neutral-800">{option.label}</div>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      )}
    </Listbox>
  );
}

export default TaskFilter;
