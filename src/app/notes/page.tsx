"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";

import { fetchNotes } from "@/api/notes";
import Error from "@/components/elements/Error";
import Loading from "@/components/elements/Loading";
import Notes from "@/components/note/Notes";
import NotesHeader from "@/components/note/NotesHeader";
import Plans from "@/components/subscription/Plans";
import { useAuth } from "@/hooks/useAuth";
import { usePageStore } from "@/hooks/usePageStore";
import { useUserStore } from "@/hooks/useUserStore";

/**
 * Notes Page
 */
function NotesPage() {
  // Refs
  const topRef = useRef<HTMLDivElement>(null);

  // Zustand States
  const setPage = usePageStore((state) => state.setPage);
  const isSubscribed = useUserStore((state) => state.isSubscribed);

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
    enabled: tokenReady && isSubscribed,
  });

  // Handle unsubscribed users
  if (!isSubscribed) {
    return <Plans />;
  }

  // Handle loading state
  if (data === undefined || isLoading) {
    return <Loading />;
  }

  // Handle error state
  if (error) {
    console.error(error);
    return <Error />;
  }

  // Render the notes page
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
