"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClipboardPlus, LoaderCircle } from "lucide-react";
import React from "react";

import { createBacklog } from "@/api/backlogs";
import { usePageStore } from "@/hooks/usePageStore";
import { Backlog, BacklogCreate } from "@/types/backlog";

interface BacklogsHeaderProps {
  data: Backlog[];
  topRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Backlogs Header
 */
function BacklogsHeader({ data, topRef }: BacklogsHeaderProps) {
  // Backlogs search related states
  const backlogsFilter = usePageStore((state) => state.backlogsFilter);
  const setBacklogsFilter = usePageStore((state) => state.setBacklogsFilter);
  const filteredBacklogs = data.filter((backlog) => {
    return (
      backlog.date.toLowerCase().includes(backlogsFilter.toLowerCase()) ||
      backlog.detail.toLowerCase().includes(backlogsFilter.toLowerCase())
    );
  });
  const backlogsLength = filteredBacklogs.length;

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
  const handleSearchBacklogs = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBacklogsFilter(e.target.value);
  };

  // Handle the backlog creation
  const { mutate: mutateCreate, isPending: isCreating } = useMutation({
    mutationFn: (newBacklog: BacklogCreate) => createBacklog(newBacklog),
    onSuccess: () => {
      // Invalidate the backlogs query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["backlogs"] });

      // Scroll to the top after a short delay
      setTimeout(() => {
        scrollToTop();
      }, 100);
    },
    onError: (error) => {
      console.error("Error creating backlog:", error);
    },
  });

  // Handle the backlog creation button click
  const handleCreateBacklog = async () => {
    mutateCreate({});
  };

  return (
    <>
      {/* Header */}
      <div className="daily-header">
        {/* Total */}
        <p className="font-medium">Total: {backlogsLength}</p>

        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Search backlogs..."
            className="h-8 rounded-xl border border-neutral-300 px-3 focus:ring focus:outline-none"
            value={backlogsFilter}
            onChange={handleSearchBacklogs}
          />
        </div>

        {/* Create Backlog Button */}
        {isCreating ? (
          <div className="spinning-btn">
            <LoaderCircle size={20} />
          </div>
        ) : (
          <button className="action-btn" onClick={handleCreateBacklog}>
            <ClipboardPlus size={20} />
          </button>
        )}
      </div>
    </>
  );
}

export default BacklogsHeader;
