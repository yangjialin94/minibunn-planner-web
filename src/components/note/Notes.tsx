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
import { Note } from "@/types/note";

/**
 * Sortable Item List for Notes
 */
function Notes({ data }: { data: Note[] }) {
  const [orderedNotes, setOrderedNotes] = useState<Note[]>([]);

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
    <div className="overflow-y-auto p-6">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={orderedNotes}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col flex-wrap gap-6">
            {orderedNotes.map((note) => {
              return <NoteItem key={note.id} id={note.id} note={note} />;
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default Notes;
