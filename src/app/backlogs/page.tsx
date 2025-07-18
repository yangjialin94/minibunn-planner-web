"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";

import { fetchBacklogs } from "@/api/backlogs";
import Backlogs from "@/components/backlog/Backlogs";
import BacklogsHeader from "@/components/backlog/BacklogsHeader";
import Error from "@/components/elements/Error";
import Loading from "@/components/elements/Loading";
import Plans from "@/components/subscription/Plans";
import { useAuth } from "@/hooks/useAuth";
import { usePageStore } from "@/hooks/usePageStore";
import { useUserStore } from "@/hooks/useUserStore";

/**
 * Backlogs Page
 */
function BacklogsPage() {
  // Refs
  const topRef = useRef<HTMLDivElement>(null);

  // Zustand States
  const setPage = usePageStore((state) => state.setPage);
  const isSubscribed = useUserStore((state) => state.isSubscribed);
  const isUserDataLoaded = useUserStore((state) => state.isUserDataLoaded);

  // Set the page
  useEffect(() => {
    setPage("backlogs");
  }, [setPage]);

  // Query client and token check
  const { user } = useAuth();
  const tokenReady = !!user;

  // Query all backlogs
  const { data, isLoading, error } = useQuery({
    queryKey: ["backlogs"],
    queryFn: () => fetchBacklogs(),
    enabled: tokenReady && isSubscribed,
  });

  // Handle unsubscribed users (only show pricing if user data is loaded and user is not subscribed)
  if (isUserDataLoaded && !isSubscribed) {
    return <Plans />;
  }

  // Handle loading state (show loading if user data is not loaded or if data is loading)
  if (!isUserDataLoaded || data === undefined || isLoading) {
    return <Loading />;
  }

  // Handle error state
  if (error) {
    console.error(error);
    return <Error />;
  }

  // Render the backlogs page
  return (
    <>
      {/* Header */}
      <BacklogsHeader data={data} topRef={topRef} />

      {/* Backlogs List */}
      <Backlogs data={data} topRef={topRef} />
    </>
  );
}

export default BacklogsPage;
