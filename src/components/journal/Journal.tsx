"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { Eraser } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { fetchOrCreateJournalByDate, updateJournal } from "@/api/journals";
import IconButton from "@/components/elements/IconButton";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";

function Journal({ dateStr }: { dateStr: string }) {
  // Subject
  const [subject, setSubject] = useState<string>("");
  const debouncedSubject = useDebounce(subject, 300);

  // Entry
  const [entry, setEntry] = useState<string>("");
  const debouncedEntry = useDebounce(entry, 300);

  // Id
  const [id, setId] = useState<number>(0);

  // Refs
  const subjectTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Check if the user is authenticated
  const { user } = useAuth();
  const tokenReady = !!user;

  // Query client
  const queryClient = useQueryClient();

  // Fetch or create journal entry
  const { data, isLoading, error } = useQuery({
    queryKey: ["journal", dateStr],
    queryFn: () => fetchOrCreateJournalByDate(dateStr),
    enabled: tokenReady,
  });

  // Resize the subject textarea based on the content
  const resizeSubjectTextarea = () => {
    const el = subjectTextareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  };

  // Load journal entry into state and resize the textarea
  useEffect(() => {
    if (data) {
      setId(data.id);
      setSubject(data.subject);
      setEntry(data.entry);
    }

    resizeSubjectTextarea();
  }, [data]);

  // Handle the journal update
  const { mutate: mutateJournal } = useMutation({
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

  // Handle the journal update - API call
  useEffect(() => {
    if (id) {
      mutateJournal(id);
    }
  }, [id, mutateJournal, debouncedSubject, debouncedEntry]);

  // Handle the journal entry update
  const handleUpdateSubject = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSubject(e.target.value);
    resizeSubjectTextarea();
  };

  // Handle the journal entry update
  const handleUpdateEntry = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  return (
    <>
      {/* Journal Entry */}
      <div className="flex h-[calc(100vh-153px)] flex-col gap-4 p-6">
        <textarea
          ref={subjectTextareaRef}
          className="w-full resize-none border-b pb-4 text-lg font-semibold break-all outline-none"
          placeholder="Subject"
          onChange={handleUpdateSubject}
          value={subject}
          rows={1}
        />
        <textarea
          className="flex-1 resize-none break-all outline-none"
          placeholder="Entry"
          onChange={handleUpdateEntry}
          value={entry}
        />
        <div className="z-10 flex justify-end">
          <IconButton
            buttonClassName="action-btn"
            onClick={handleClearJournal}
            icon={<Eraser />}
            tooltipText="Clear"
          />
        </div>
      </div>
    </>
  );
}

export default Journal;
