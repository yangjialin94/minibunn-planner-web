"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { Eraser } from "lucide-react";
import React, { useEffect, useState } from "react";

import { fetchOrCreateJournalByDate, updateJournal } from "@/api/journals";
import Error from "@/components/elements/Error";
import Loading from "@/components/elements/Loading";
import RichTextEditor from "@/components/elements/RichTextEditor";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";

function Journal({ dateStr }: { dateStr: string }) {
  // Subject
  const [subject, setSubject] = useState<string>("");
  const debouncedSubject = useDebounce(subject, 300);

  // Entry
  const [entry, setEntry] = useState<string>("");
  const debouncedEntry = useDebounce(entry, 300);

  // Id and first load state
  const [id, setId] = useState<number>(0);
  const [firstLoad, setFirstLoad] = useState(true);

  // Check for query client
  const { user } = useAuth();
  const tokenReady = !!user;
  const queryClient = useQueryClient();

  // Fetch or create journal entry
  const { data, isLoading, error } = useQuery({
    queryKey: ["journal", dateStr],
    queryFn: () => fetchOrCreateJournalByDate(dateStr),
    enabled: tokenReady,
  });

  // Load journal entry into state and resize the textarea
  useEffect(() => {
    if (data && firstLoad) {
      setId(data.id);
      setSubject(data.subject || "");
      setEntry(data.entry || "");
      setFirstLoad(false);
    }
  }, [data, firstLoad]);

  // Handle the journal update
  const { mutate: mutateJournal } = useMutation({
    mutationFn: (journalId: number) =>
      updateJournal(journalId, { subject: subject, entry: entry }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal", dateStr] });
      console.log("Journal updated successfully.");
    },
    onError: (error) => {
      console.error("Error updating journal:", error);
    },
  });

  // Handle the journal update - API call
  useEffect(() => {
    if (!firstLoad && id !== null) {
      mutateJournal(id);
    }
  }, [id, mutateJournal, debouncedSubject, debouncedEntry, firstLoad]);

  // Handle the journal entry update
  const handleUpdateSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
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
    <div className="flex flex-1 flex-col px-6 pt-4">
      {/* Editor container */}
      <div className="overflow-y-auto">
        {/* Journal title */}
        <input
          className="w-full text-lg font-semibold overflow-ellipsis outline-none"
          placeholder="Subject"
          onChange={handleUpdateSubject}
          value={subject}
        />

        {/* Journal entry */}
        <div className="mt-4 h-[calc(100dvh-296px)] sm:h-[calc(100dvh-256px)]">
          <RichTextEditor
            html={entry}
            onChange={setEntry}
            placeholder="Start writing..."
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-end">
        <button className="action-btn" onClick={handleClearJournal}>
          <Eraser />
        </button>
      </div>
    </div>
  );
}

export default Journal;
