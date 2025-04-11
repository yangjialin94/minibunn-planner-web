"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClipboardPlus, LoaderCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { createNote } from "@/api/notes";
import IconButton from "@/components/elements/IconButton";
import Notes from "@/components/note/Notes";
import { usePageStore } from "@/hooks/usePageStore";
import { NoteCreate } from "@/types/note";

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
      <Notes
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
