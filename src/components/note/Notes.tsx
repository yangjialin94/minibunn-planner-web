"use client";

import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

import { fetchNotes, updateNote } from "@/api/notes";
import NoteItem from "@/components/note/NoteItem";
import { useAuth } from "@/hooks/useAuth";
import { Note } from "@/types/note";

/**
 * Sortable Item List for Notes
 */
function Notes() {
  const [orderedNotes, setOrderedNotes] = useState<Note[]>([]);

  const { user } = useAuth();
  const tokenReady = !!user;

  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["notes"],
    queryFn: () => fetchNotes(),
    enabled: tokenReady,
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
