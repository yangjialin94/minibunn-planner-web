"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { Eraser } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { fetchOrCreateJournalByDate, updateJournal } from "@/api/journals";
import Error from "@/components/elements/Error";
import IconButton from "@/components/elements/IconButton";
import Loading from "@/components/elements/Loading";
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
      el.style.height = el.scrollHeight + 2 + "px";
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
  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    console.error(error);
    return <Error />;
  }

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      {/* Journal title */}
      <textarea
        ref={subjectTextareaRef}
        className="w-full resize-none border-b border-neutral-800 pb-4 text-lg font-semibold outline-none"
        placeholder="Subject"
        onChange={handleUpdateSubject}
        value={subject}
        rows={1}
      />

      {/* Journal entry */}
      <textarea
        className="mt-4 w-full flex-1 resize-none overflow-auto outline-none"
        placeholder="Entry"
        onChange={handleUpdateEntry}
        value={entry}
      />

      {/* Footer */}
      <div className="mt-4 flex flex-shrink-0 justify-end">
        <IconButton
          buttonClassName="action-btn"
          onClick={handleClearJournal}
          icon={<Eraser />}
          tooltipText="Clear"
        />
      </div>
    </div>
  );
}

export default Journal;
