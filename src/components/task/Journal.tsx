"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { Eraser, Save, SquarePen } from "lucide-react";
import React, { useEffect, useState } from "react";

import { fetchOrCreateJournalByDate, updateJournal } from "@/api/journals";
import IconButton from "@/components/elements/IconButton";
import { useAuth } from "@/hooks/useAuth";

function Journal({ dateStr }: { dateStr: string }) {
  const { user } = useAuth();
  const tokenReady = !!user;

  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["journal", dateStr],
    queryFn: () => fetchOrCreateJournalByDate(dateStr),
    enabled: tokenReady,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState<number>(0);
  const [subject, setSubject] = useState<string>("");
  const [entry, setEntry] = useState<string>("");

  useEffect(() => {
    if (data) {
      setId(data.id);
      setSubject(data.subject);
      setEntry(data.entry);
    }
  }, [data]);

  // Handle the task order update
  const { mutate: mutateJournal, isPending: isUpdating } = useMutation({
    mutationFn: (journalId: number) =>
      updateJournal(journalId, { subject: subject, entry: entry }),
    onSuccess: () => {
      // Invalidate the journal query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["journal", dateStr] });
    },
    onError: (error) => {
      console.error("Error updating journal:", error);
    },
  });

  // Handle edit journal
  const handleEditJournal = () => {
    setIsEditing(!isEditing);
  };

  // Handle update journal
  const handleUpdateJournal = () => {
    mutateJournal(id);
    setIsEditing(!isEditing);
  };

  // Handle subject changes
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  // Handle entry changes
  const handleEntryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEntry(e.target.value);
  };

  // Handle clear journal
  const handleClearJournal = () => {
    setSubject("");
    setEntry("");
  };

  // Handle loading and error states
  if (isLoading) return <div className="p-4">Loading journal...</div>;
  if (error) {
    console.error(error);
    return <div className="p-4">Error loading journal.</div>;
  }

  if (isUpdating) {
    return <div className="p-4">Saving...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-153px)] flex-col gap-4 p-4">
      <input
        type="text"
        disabled={!isEditing}
        className="h-12 w-full border-b border-neutral-800 p-4 text-xl font-semibold outline-none"
        placeholder="Subject"
        onChange={handleSubjectChange}
        value={subject}
      />
      <textarea
        disabled={!isEditing}
        className="flex-1 resize-none p-4 outline-none"
        placeholder="Write your entry here..."
        onChange={handleEntryChange}
        value={entry}
      />
      <div className="z-10 flex justify-between">
        {isEditing ? (
          <>
            <IconButton
              buttonClassName="action-btn"
              onClick={handleClearJournal}
              icon={<Eraser />}
              tooltipText="Clear"
              tooltipPosition="-top-8 right-0"
            />
            <IconButton
              buttonClassName="action-btn"
              onClick={handleUpdateJournal}
              icon={<Save />}
              tooltipText="Save"
              tooltipPosition="-top-8 right-0"
            />
          </>
        ) : (
          <>
            <div className="fill-neutral-100"></div>
            <IconButton
              buttonClassName="action-btn"
              onClick={handleEditJournal}
              icon={<SquarePen />}
              tooltipText="Clear"
              tooltipPosition="-top-8 right-0"
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Journal;
