"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { ClipboardPlus, LoaderCircle } from "lucide-react";
import React, { useEffect, useRef } from "react";

import { createNote, fetchNotes } from "@/api/notes";
import Error from "@/components/elements/Error";
import IconButton from "@/components/elements/IconButton";
import Loading from "@/components/elements/Loading";
import Notes from "@/components/note/Notes";
import { useAuth } from "@/hooks/useAuth";
import { usePageStore } from "@/hooks/usePageStore";
import { Note, NoteCreate } from "@/types/note";

/**
 * Notes Header
 */
function NotesHeader({ data }: { data: Note[] }) {
  // Refs
  const topRef = useRef<HTMLDivElement>(null);

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
    <div className="sticky top-0 z-20">
      <div className="daily-header">
        {/* Total */}
        <p className="font-medium">Total: {data.length}</p>

        {isCreating ? (
          <div className="spinning-btn">
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
        )}
      </div>

      {/* Ref for the top */}
      <div ref={topRef} className="invisible h-0" />
    </div>
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

  // Query client and token check
  const { user } = useAuth();
  const tokenReady = !!user;

  // Query all notes
  const { data, isLoading, error } = useQuery({
    queryKey: ["notes"],
    queryFn: () => fetchNotes(),
    enabled: tokenReady,
  });

  // Handle loading and error states
  if (data === undefined || isLoading) {
    return <Loading />;
  }
  if (error) {
    console.error(error);
    return <Error />;
  }

  return (
    <div className="scrollable-content">
      <NotesHeader data={data} />

      <div className="flex-1">
        <Notes data={data} />
      </div>
    </div>
  );
}

export default NotesPage;
