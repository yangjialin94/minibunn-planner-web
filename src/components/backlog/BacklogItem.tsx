"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { GripVertical, LoaderCircle, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { deleteBacklog, updateBacklog } from "@/api/backlogs";
import RichTextEditor from "@/components/elements/RichTextEditor";
import { useDebounce } from "@/hooks/useDebounce";
import { Backlog } from "@/types/backlog";

interface BacklogItemProps {
  id: number;
  backlog: Backlog;
  isDraggable: boolean;
}

/**
 * Sortable Item for Backlogs
 */
function BacklogItem({ id, backlog, isDraggable }: BacklogItemProps) {
  // Detail
  const [detail, setDetail] = useState(backlog.detail);
  const debouncedDetail = useDebounce(detail, 300);

  // Backlog editor focus and hover states
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Refs
  const itemRef = useRef<HTMLDivElement>(null);

  // Handle the backlog detail change
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  // Combine the refs
  const setCombinedRef = useCallback(
    (node: HTMLDivElement | null) => {
      setNodeRef(node);
      itemRef.current = node;
    },
    [setNodeRef],
  );

  // Query client
  const queryClient = useQueryClient();

  // Style for the sortable item
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    pointerEvents: "auto",
  };

  // Handle the backlog update
  const { mutate: mutateUpdate } = useMutation({
    mutationFn: (backlogId: number) =>
      updateBacklog(backlogId, { detail: detail }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backlogs"] });
    },
    onError: (error) => {
      console.error("Error updating backlog:", error);
    },
  });

  // Handle the backlog deletion
  const { mutate: mutateDelete, isPending: isDeleting } = useMutation({
    mutationFn: (backlogId: number) => deleteBacklog(backlogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backlogs"] });
    },
    onError: (error) => {
      console.error("Error deleting backlog:", error);
    },
  });

  // Handle the backlog update - API call
  useEffect(() => {
    if (debouncedDetail !== backlog.detail) {
      mutateUpdate(backlog.id);
    }
  }, [debouncedDetail, mutateUpdate, backlog.detail, backlog.id]);

  // Handle the backlog deletion
  const handleDeleteBacklog = async () => {
    mutateDelete(backlog.id);
  };

  return (
    <div
      ref={setCombinedRef}
      style={style}
      className="group relative cursor-default"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Backlog item */}
      <div className="relative flex items-center rounded-xl border border-neutral-300 bg-white px-2 py-4 hover:ring">
        {/* Drag handle */}
        {isDraggable && (
          <button
            {...attributes}
            {...listeners}
            className={clsx("action-btn relative mr-1 cursor-grab", {
              invisible: !isFocused && !isHovered,
            })}
          >
            <GripVertical size={20} />
          </button>
        )}

        {/* Backlog editor */}
        <div
          className={clsx("flex flex-1 flex-col gap-4 py-2", {
            "ml-2": !isDraggable,
          })}
        >
          {/* Backlog entry */}
          <RichTextEditor
            html={detail}
            onChange={setDetail}
            placeholder="Type your backlog here..."
          />

          {/* Backlog creation date */}
          <p className="text-neutral-500">{backlog.date}</p>
        </div>

        {/* Action Buttons */}
        {isDeleting ? (
          <div className="spinning-btn">
            <LoaderCircle size={20} />
          </div>
        ) : (
          <button
            className={clsx("action-btn red", {
              invisible: !isFocused && !isHovered,
            })}
            onClick={handleDeleteBacklog}
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

export default BacklogItem;
