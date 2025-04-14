"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClipboardPlus, LoaderCircle, Search } from "lucide-react";
import React, { useEffect, useRef } from "react";

import { createNote } from "@/api/notes";
import IconButton from "@/components/elements/IconButton";
import Notes from "@/components/note/Notes";
import { usePageStore } from "@/hooks/usePageStore";
import { NoteCreate } from "@/types/note";

/**
 * Notes Header
 */
function NotesHeader({
  bottomRef,
}: {
  bottomRef: React.RefObject<HTMLDivElement | null>;
}) {
  // Search query
  const [query, setQuery] = React.useState("");

  // Query client
  const queryClient = useQueryClient();

  // Handle filter notes
  const handleFilterNotes = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Handle scroll to bottom
  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle the note creation
  const { mutate: mutateCreate, isPending: isCreating } = useMutation({
    mutationFn: (newNote: NoteCreate) => createNote(newNote),
    onSuccess: () => {
      // Invalidate the notes query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["notes"] });

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
    <div className="daily-header">
      {/* Search bar */}
      <div className="flex w-full items-center gap-2">
        <Search className="mr-2" />
        <input
          type="text"
          value={query}
          onChange={handleFilterNotes}
          placeholder="Search coming soon..."
          className="text-lg outline-none"
          disabled
        />
      </div>

      {isCreating ? (
        <div className="loading-btn">
          <LoaderCircle />
        </div>
      ) : (
        <IconButton
          buttonClassName="action-btn"
          onClick={handleCreateNote}
          icon={<ClipboardPlus />}
          tooltipText="Create"
          placement="bottom"
        />

        // TODO: Multi-select button
      )}
    </div>
  );
}

/**
 * Notes Page
 */
function NotesPage() {
  // Refs
  const bottomRef = useRef<HTMLDivElement>(null);

  // Page state
  const setPage = usePageStore((state) => state.setPage);

  // Set the page
  useEffect(() => {
    setPage("notes");
  }, [setPage]);

  return (
    <div className="scrollable-content">
      <NotesHeader bottomRef={bottomRef} />

      <div className="flex-1">
        <Notes bottomRef={bottomRef} />
      </div>
    </div>
  );
}

export default NotesPage;
