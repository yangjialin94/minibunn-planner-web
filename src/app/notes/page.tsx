"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";

import { fetchNotes } from "@/api/notes";
import Error from "@/components/elements/Error";
import Loading from "@/components/elements/Loading";
import Notes from "@/components/note/Notes";
import NotesHeader from "@/components/note/NotesHeader";
import { useAuth } from "@/hooks/useAuth";
import { usePageStore } from "@/hooks/usePageStore";

/**
 * Notes Page
 */
function NotesPage() {
  // Refs
  const topRef = useRef<HTMLDivElement>(null);

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
    <>
      {/* Header */}
      <NotesHeader data={data} topRef={topRef} />

      {/* Notes List */}
      <Notes data={data} topRef={topRef} />
    </>
  );
}

export default NotesPage;
