"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { Eraser } from "lucide-react";
import React, { useEffect, useState } from "react";

import { fetchOrCreateNoteByDate, updateNote } from "@/api/notes";
import Error from "@/components/elements/Error";
import Loading from "@/components/elements/Loading";
import RichTextEditor from "@/components/elements/RichTextEditor";
import Plans from "@/components/subscription/Plans";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { useUserStore } from "@/hooks/useUserStore";

function Note({ dateStr }: { dateStr: string }) {
  // Entry
  const [entry, setEntry] = useState<string>("");
  const debouncedEntry = useDebounce(entry, 300);

  // Id and first load state
  const [id, setId] = useState<number>(0);
  const [firstLoad, setFirstLoad] = useState(true);

  // Zustand state for user subscription
  const isSubscribed = useUserStore((state) => state.isSubscribed);
  const isUserDataLoaded = useUserStore((state) => state.isUserDataLoaded);

  // Check for query client
  const { user } = useAuth();
  const tokenReady = !!user;
  const queryClient = useQueryClient();

  // Fetch or create note entry
  const { data, isLoading, error } = useQuery({
    queryKey: ["note", dateStr],
    queryFn: () => fetchOrCreateNoteByDate(dateStr),
    enabled: tokenReady,
  });

  // Load note entry into state and resize the textarea
  useEffect(() => {
    if (data && firstLoad) {
      setId(data.id);
      setEntry(data.entry || "");

      setFirstLoad(false);
    }
  }, [data, firstLoad]);

  // Handle the note update
  const { mutate: mutateNote } = useMutation({
    mutationFn: (noteId: number) => updateNote(noteId, { entry: entry }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note", dateStr] });
      console.log("Note updated successfully.");
    },
    onError: (error) => {
      console.error("Error updating note:", error);
    },
  });

  // Handle the note update - API call
  useEffect(() => {
    if (!firstLoad && id !== null) {
      mutateNote(id);
    }
  }, [id, mutateNote, debouncedEntry, firstLoad]);

  // Handle unsubscribed users (only show pricing if user data is loaded and user is not subscribed)
  if (isUserDataLoaded && !isSubscribed) {
    return <Plans />;
  }

  // Handle loading and error states (show loading if user data is not loaded or if data is loading)
  if (!isUserDataLoaded || isLoading) {
    return <Loading />;
  }
  if (error) {
    console.error(error);
    return <Error />;
  }

  // Handle clear note
  const handleClearNote = () => {
    setEntry("");
  };

  return (
    <div className="flex flex-1 flex-col px-6 pt-4">
      {/* Editor container */}
      <div className="overflow-y-auto">
        {/* Note entry */}
        <div className="mt-4 h-[calc(100dvh-270px)] sm:h-[calc(100dvh-230px)]">
          <RichTextEditor
            html={entry}
            onChange={setEntry}
            placeholder="Start writing..."
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-end">
        <button className="action-btn" onClick={handleClearNote}>
          <Eraser />
        </button>
      </div>
    </div>
  );
}

export default Note;
