"use client";

import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import {
  ClipboardPlus,
  LoaderCircle,
  Save,
  SquarePen,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { createNote, deleteNote, fetchNotes, updateNote } from "@/api/notes";
import IconButton from "@/components/elements/IconButton";
import { usePageStore } from "@/hooks/usePageStore";
import { NoteCreate } from "@/types/note";
import { Note } from "@/types/note";

interface ItemListProps {
  bottomRef: React.RefObject<HTMLDivElement | null>;
  editingId: number | null;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
}

interface SortableItemProps {
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
function SortableItem({
  id,
  note,
  isEditing,
  startEditing,
  cancelEditing,
  editingId,
}: SortableItemProps) {
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

/**
 * Sortable Item List for Notes
 */
function ItemList({ bottomRef, editingId, setEditingId }: ItemListProps) {
  const [orderedNotes, setOrderedNotes] = useState<Note[]>([]);

  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["notes"],
    queryFn: () => fetchNotes(),
  });

  // Handle the note order update
  const { mutate: mutateUpdateOrder, isPending: isUpdating } = useMutation({
    mutationFn: ({ noteId, order }: { noteId: number; order: number }) =>
      updateNote(noteId, { order: order }),
    onSuccess: () => {
      // Invalidate the notes query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error("Error updating note order:", error);
    },
  });

  // Handle the note order update
  useEffect(() => {
    if (data) {
      setOrderedNotes(data);
    }
  }, [data]);

  // Update note order
  const handleDragEnd = (event: DragEndEvent) => {
    if (isUpdating) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedNotes.findIndex((item) => item.id === active.id);
    const newIndex = orderedNotes.findIndex((item) => item.id === over.id);
    const newOrder = arrayMove(orderedNotes, oldIndex, newIndex);
    setOrderedNotes(newOrder);

    // Update the order in the backend
    mutateUpdateOrder({ noteId: Number(active.id), order: newIndex + 1 });
  };

  // Handle loading and error states
  if (isLoading) return <div className="p-4">Loading notes...</div>;
  if (error) {
    console.error(error);
    return <div className="p-4">Error loading notes.</div>;
  }

  return (
    <>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={orderedNotes}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col flex-wrap gap-4">
            {orderedNotes.map((note) => {
              return (
                <SortableItem
                  key={note.id}
                  id={note.id}
                  note={note}
                  isEditing={editingId === note.id}
                  startEditing={() => setEditingId(note.id)}
                  cancelEditing={() => setEditingId(null)}
                  editingId={editingId}
                />
              );
            })}
            <div ref={bottomRef} />
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
}

/**
 * Notes Page
 */
function NotesPage() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const setPage = usePageStore((state) => state.setPage);

  const queryClient = useQueryClient();

  // Set the page
  useEffect(() => {
    setPage("notes");
  }, [setPage]);

  // Handle scroll to bottom
  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle the note creation
  const { mutate: mutateCreate, isPending: isCreating } = useMutation({
    mutationFn: (newNote: NoteCreate) => createNote(newNote),
    onSuccess: (createdNote) => {
      // Invalidate the notes query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["notes"] });

      // Set the editing ID to the newly created note
      setEditingId(createdNote.id);

      // Scroll to the bottom after a short delay
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    },
    onError: (error) => {
      console.error("Error creating note:", error);
    },
  });

  // Handle the note creation button click
  const handleCreateNote = async () => {
    mutateCreate({});
  };

  return (
    <div className="scrollable-content p-4">
      {/* <Note List /> */}
      <ItemList
        bottomRef={bottomRef}
        editingId={editingId}
        setEditingId={setEditingId}
      />

      {/* Create Button */}
      <div className="fixed right-8 bottom-8 z-10 inline-block">
        {isCreating ? (
          <div className="flex justify-center">
            <div className="loading-btn">
              <LoaderCircle />
            </div>
          </div>
        ) : editingId !== null ? null : (
          <div className="flex justify-end">
            <IconButton
              buttonClassName="action-btn"
              onClick={handleCreateNote}
              icon={<ClipboardPlus />}
              tooltipText="Create"
              tooltipPosition="-right-2 bottom-12"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default NotesPage;
