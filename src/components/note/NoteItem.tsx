"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { LoaderCircle, Save, SquarePen, Trash2, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { deleteNote, updateNote } from "@/api/notes";
import IconButton from "@/components/elements/IconButton";
import { Note } from "@/types/note";

interface NoteItemProps {
  id: number;
  note: Note;
  isEditing: boolean;
  startEditing: () => void;
  cancelEditing: () => void;
  editingId: number | null;
}

/**
 * Sortable Item for Notes
 */
function NoteItem({
  id,
  note,
  isEditing,
  startEditing,
  cancelEditing,
  editingId,
}: NoteItemProps) {
  const [noteDetail, setNoteDetail] = useState(note.detail);
  const [originalNoteDetail, setOriginalNoteDetail] = useState(note.detail);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const queryClient = useQueryClient();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    pointerEvents: "auto",
  };

  // Resize the textarea based on the content
  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  };

  // Reset the textarea height when the component mounts
  useEffect(() => {
    setTimeout(() => {
      resizeTextarea();
    }, 0);
  }, [isEditing]);

  // Handle the note detail change
  const handleStartEditing = () => {
    setOriginalNoteDetail(noteDetail);
    startEditing();
  };

  // Handle the note cancel
  const handleCancel = () => {
    if (originalNoteDetail === "") {
      mutateDelete(note.id);
    } else {
      setNoteDetail(originalNoteDetail);
    }
    cancelEditing();
  };

  // Handle the note update
  const { mutate: mutateUpdate, isPending: isUpdating } = useMutation({
    mutationFn: (noteId: number) => updateNote(noteId, { detail: noteDetail }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      cancelEditing();
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

  // Handle the note textarea change
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteDetail(e.target.value);
    resizeTextarea();
  };

  // Handle the note update
  const handleUpdateNote = async () => {
    mutateUpdate(note.id);
  };

  // Handle the note deletion
  const handleDeleteNote = async () => {
    mutateDelete(note.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!isEditing ? { ...attributes, ...listeners } : {})}
      className={clsx(
        "flex cursor-grab flex-wrap items-center justify-between gap-4 rounded-xl p-4",
        {
          "border-2": isEditing,
          border: !isEditing,
        },
      )}
    >
      {/* Note Detail */}
      {isEditing ? (
        <div className="flex flex-1">
          <textarea
            ref={textareaRef}
            className="w-full resize-none outline-none"
            placeholder="Write your note here..."
            onChange={handleNoteChange}
            value={noteDetail}
          />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-between">
          <p className="w-full break-all whitespace-pre-wrap">{noteDetail}</p>
          <p className="w-28 text-neutral-500">{note.date}</p>
        </div>
      )}

      {/* Action Buttons */}
      {isDeleting || isUpdating ? (
        <div className="flex w-24 justify-end">
          <div className="loading-btn">
            <LoaderCircle />
          </div>
        </div>
      ) : isEditing ? (
        <div className="flex w-24 justify-end">
          <IconButton
            buttonClassName="action-btn"
            onClick={handleCancel}
            icon={<X />}
            tooltipText="Cancel"
            tooltipPosition="-top-8 -right-2"
          />
          <IconButton
            buttonClassName={clsx("action-btn", {
              hidden: noteDetail.trim() === "",
            })}
            onClick={handleUpdateNote}
            icon={<Save />}
            tooltipText="Save"
            tooltipPosition="-top-8 -right-0"
          />
        </div>
      ) : editingId === null ? (
        <div className="flex w-24 justify-end">
          <IconButton
            buttonClassName="action-btn"
            onClick={handleStartEditing}
            icon={<SquarePen />}
            tooltipText="Edit"
            tooltipPosition="-top-8 -right-0"
          />
          <IconButton
            buttonClassName="action-btn"
            onClick={handleDeleteNote}
            icon={<Trash2 />}
            tooltipText="Delete"
            tooltipPosition="-top-8 -right-2"
          />
        </div>
      ) : null}
    </div>
  );
}

export default NoteItem;
