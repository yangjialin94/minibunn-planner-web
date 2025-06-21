"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClipboardPlus, LoaderCircle } from "lucide-react";
import React from "react";

import { createNote } from "@/api/notes";
import { usePageStore } from "@/hooks/usePageStore";
import { Note, NoteCreate } from "@/types/note";

interface NotesHeaderProps {
  data: Note[];
  topRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Notes Header
 */
function NotesHeader({ data, topRef }: NotesHeaderProps) {
  // Notes search related states
  const notesFilter = usePageStore((state) => state.notesFilter);
  const setNotesFilter = usePageStore((state) => state.setNotesFilter);
  const filteredNotes = data.filter((note) => {
    return (
      note.date.toLowerCase().includes(notesFilter.toLowerCase()) ||
      note.detail.toLowerCase().includes(notesFilter.toLowerCase())
    );
  });
  const notesLength = filteredNotes.length;

  // Query client
  const queryClient = useQueryClient();

  // Handle scroll to top
  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  // Handle the search input change
  const handleSearchNotes = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotesFilter(e.target.value);
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
      {/* Header */}
      <div className="daily-header">
        {/* Total */}
        <p className="font-medium">Total: {notesLength}</p>

        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Search notes..."
            className="h-8 rounded-xl border border-neutral-300 px-3 focus:ring focus:outline-none"
            value={notesFilter}
            onChange={handleSearchNotes}
          />
        </div>

        {/* Create Note Button */}
        {isCreating ? (
          <div className="spinning-btn">
            <LoaderCircle size={20} />
          </div>
        ) : (
          <button className="action-btn" onClick={handleCreateNote}>
            <ClipboardPlus size={20} />
          </button>
        )}
      </div>
    </>
  );
}

export default NotesHeader;
