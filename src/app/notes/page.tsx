"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClipboardPlus, LoaderCircle } from "lucide-react";
// import { ClipboardPlus, LoaderCircle, Search } from "lucide-react";
import React, { useEffect, useRef } from "react";

import { createNote } from "@/api/notes";
import IconButton from "@/components/elements/IconButton";
import Notes from "@/components/note/Notes";
import { usePageStore } from "@/hooks/usePageStore";
import { NoteCreate } from "@/types/note";

/**
 * Notes Header
 */
function NotesHeader() {
  // Refs
  const topRef = useRef<HTMLDivElement>(null);

  // Search query
  // const [query, setQuery] = React.useState("");

  // Query client
  const queryClient = useQueryClient();

  // Handle filter notes
  // const handleFilterNotes = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setQuery(e.target.value);
  // };

  // Handle scroll to top
  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  // Handle the note creation
  const { mutate: mutateCreate, isPending: isCreating } = useMutation({
    mutationFn: (newNote: NoteCreate) => createNote(newNote),
    onSuccess: () => {
      // Invalidate the notes query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["notes"] });

      // Scroll to the top after a short delay
      setTimeout(() => {
        scrollToTop();
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
    <>
      <div className="daily-header">
        {/* Search bar */}
        <div className="flex w-full items-center gap-2">
          {/* <Search className="mr-2" />
        <input
          type="text"
          value={query}
          onChange={handleFilterNotes}
          placeholder="Search coming soon..."
          className="text-lg outline-none"
          disabled
        /> */}
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

      {/* Ref for the top */}
      <div ref={topRef} className="invisible h-0" />
    </>
  );
}

/**
 * Notes Page
 */
function NotesPage() {
  // Page state
  const setPage = usePageStore((state) => state.setPage);

  // Set the page
  useEffect(() => {
    setPage("notes");
  }, [setPage]);

  return (
    <div className="scrollable-content">
      <NotesHeader />

      <div className="flex-1">
        <Notes />
      </div>
    </div>
  );
}

export default NotesPage;
