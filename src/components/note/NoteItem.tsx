"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { GripVertical, LoaderCircle, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { deleteNote, updateNote } from "@/api/notes";
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

  // Refs
  const itemRef = useRef<HTMLDivElement>(null);
  const DetailTextareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Resize the textarea based on the content
  const resizeDetailTextarea = () => {
    const el = DetailTextareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  };

  // Reset the textarea height
  useEffect(() => {
    setTimeout(() => {
      resizeDetailTextarea();
    }, 0);
  }, [note]);

  // Scroll to the item when editing
  const handleCenterItem = () => {
    if (itemRef.current) {
      itemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
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

  // Handle the note update - local state
  const handleUpdateDetail = async (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDetail(e.target.value);
    resizeDetailTextarea();
  };

  // Handle the note deletion
  const handleDeleteNote = async () => {
    mutateDelete(note.id);
  };

  return (
    <div
      ref={setCombinedRef}
      style={style}
      className="group relative cursor-default"
    >
      {/* Note item */}
      <div className="relative flex items-start rounded-xl border border-neutral-300 bg-white p-2 hover:ring">
        {/* Drag handle */}
        {isDraggable && (
          <button
            {...attributes}
            {...listeners}
            className="action-btn relative mr-1 cursor-grab"
          >
            <GripVertical size={20} />
          </button>
        )}

        {/* Note Detail */}
        <div
          className={clsx("flex flex-1 flex-col gap-4 py-1", {
            "ml-2": !isDraggable,
          })}
        >
          <textarea
            ref={DetailTextareaRef}
            className="w-full resize-none outline-none"
            placeholder="Detail"
            onChange={handleUpdateDetail}
            onFocus={handleCenterItem}
            value={detail}
            rows={1}
          />
          <p className="text-neutral-500">{note.date}</p>
        </div>

        {/* Action Buttons */}
        {isDeleting ? (
          <div className="spinning-btn">
            <LoaderCircle size={20} />
          </div>
        ) : (
          <button className="action-btn red" onClick={handleDeleteNote}>
            <Trash2 size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

export default NoteItem;
