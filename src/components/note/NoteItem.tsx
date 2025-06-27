"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { GripVertical, LoaderCircle, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { deleteNote, updateNote } from "@/api/notes";
import RichTextEditor from "@/components/elements/RichTextEditor";
import { useDebounce } from "@/hooks/useDebounce";
import { Note } from "@/types/note";

interface NoteItemProps {
  id: number;
  note: Note;
  isDraggable: boolean;
}

/**
 * Sortable Item for Notes
 */
function NoteItem({ id, note, isDraggable }: NoteItemProps) {
  // Detail
  const [detail, setDetail] = useState(note.detail);
  const debouncedDetail = useDebounce(detail, 300);

  // Note editor focus and hover states
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Refs
  const itemRef = useRef<HTMLDivElement>(null);

  // Handle the note detail change
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

  // Handle the note update
  const { mutate: mutateUpdate } = useMutation({
    mutationFn: (noteId: number) => updateNote(noteId, { detail: detail }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error("Error updating note:", error);
    },
  });

  // Handle the note deletion
  const { mutate: mutateDelete, isPending: isDeleting } = useMutation({
    mutationFn: (noteId: number) => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error("Error deleting note:", error);
    },
  });

  // Handle the note update - API call
  useEffect(() => {
    if (debouncedDetail !== note.detail) {
      mutateUpdate(note.id);
    }
  }, [debouncedDetail, mutateUpdate, note.detail, note.id]);

  // Handle the note deletion
  const handleDeleteNote = async () => {
    mutateDelete(note.id);
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
      {/* Note item */}
      <div className="relative flex items-center rounded-xl border border-neutral-300 px-2 py-4 hover:ring">
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

        {/* Note editor */}
        <div
          className={clsx("flex flex-1 flex-col gap-4 py-2", {
            "ml-2": !isDraggable,
          })}
        >
          {/* Note entry */}
          <RichTextEditor
            html={detail}
            onChange={setDetail}
            placeholder="Type your note here..."
          />

          {/* Note creation date */}
          <p className="text-neutral-500">{note.date}</p>
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
            onClick={handleDeleteNote}
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

export default NoteItem;
