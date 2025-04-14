"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GripVertical, LoaderCircle, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { deleteNote, updateNote } from "@/api/notes";
import IconButton from "@/components/elements/IconButton";
import { useDebounce } from "@/hooks/useDebounce";
import { Note } from "@/types/note";

/**
 * Sortable Item for Notes
 */
function NoteItem({ id, note }: { id: number; note: Note }) {
  // Detail
  const [detail, setDetail] = useState(note.detail);
  const debouncedDetail = useDebounce(detail, 300);

  // Refs
  const DetailTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle the note detail change
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

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

  // Handle the note update
  const { mutate: mutateUpdate, isPending: isUpdating } = useMutation({
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
      ref={setNodeRef}
      style={style}
      className="group relative cursor-default"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="peer absolute top-1/2 -left-4 z-10 hidden -translate-y-1/2 transform group-hover:block"
      >
        <div className="relative">
          <button className="peer cursor-grab rounded-full border bg-neutral-100 p-2 hover:border-2 hover:bg-neutral-300">
            <GripVertical size={16} />
          </button>
          <div className="tool-tip top">Drag</div>
        </div>
      </div>

      {/* Note item */}
      <div className="relative flex flex-col rounded-xl border border-neutral-800 p-4 peer-hover:border-2 hover:border-2">
        {/* Note Detail */}
        <div className="flex px-4">
          <textarea
            ref={DetailTextareaRef}
            className="w-full resize-none outline-none"
            placeholder="Detail"
            onChange={handleUpdateDetail}
            value={detail}
            rows={1}
          />
        </div>

        {/* Action Buttons */}
        {isUpdating || isDeleting ? (
          <div className="flex justify-center pt-2">
            <div className="loading-btn">
              <LoaderCircle />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-2">
            <p className="ml-4 text-neutral-500">{note.date}</p>
            <IconButton
              buttonClassName="action-btn"
              onClick={handleDeleteNote}
              icon={<Trash2 />}
              tooltipText="Delete"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default NoteItem;
