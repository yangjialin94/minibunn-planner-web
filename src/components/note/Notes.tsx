"use client";

import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

import { updateNote } from "@/api/notes";
import NoteItem from "@/components/note/NoteItem";
import { usePageStore } from "@/hooks/usePageStore";
import { Note } from "@/types/note";

interface NotesProps {
  data: Note[];
  topRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Sortable Item List for Notes
 */
function Notes({ data, topRef }: NotesProps) {
  // Ordered notes state
  const [orderedNotes, setOrderedNotes] = useState<Note[]>([]);

  // Page store
  const notesFilter = usePageStore((state) => state.notesFilter);
  const isDraggable = notesFilter.trim() === "" ? true : false;

  // Query client
  const queryClient = useQueryClient();

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

  return (
    <div className="overflow-y-auto">
      {/* Ref for the top */}
      <div ref={topRef} />

      {/* Notes */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={orderedNotes}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col flex-wrap gap-4 p-4">
            {orderedNotes.map((note) => {
              console.log(note);
              if (
                notesFilter &&
                !note.date.toLowerCase().includes(notesFilter.toLowerCase()) &&
                !note.detail.toLowerCase().includes(notesFilter.toLowerCase())
              ) {
                return null;
              }

              return (
                <NoteItem
                  key={note.id}
                  id={note.id}
                  note={note}
                  isDraggable={isDraggable}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default Notes;
