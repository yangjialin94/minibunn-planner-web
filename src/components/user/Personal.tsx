"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ActionCodeSettings, sendPasswordResetEmail } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { fetchUser, updateUser } from "@/api/user";
import { auth } from "@/auth/firebaseClient";
import Error from "@/components/elements/Error";
import Loading from "@/components/elements/Loading";
import { NEXT_PUBLIC_WEB_URL } from "@/env";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";

/**
 * Personal Component
 */
function Personal() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if the user is authenticated
  const { user } = useAuth();
  const tokenReady = !!user;

  // Query client
  const queryClient = useQueryClient();

  // Fetch user info
  const {
    data,
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUser(),
    enabled: tokenReady,
  });

  // Name
  const [name, setName] = useState(data?.name || "");
  const [nameChanged, setNameChanged] = useState(false);
  const debouncedName = useDebounce(name, 300);

  // Id
  const [id, setId] = useState<number>(0);

  // Update name in state
  useEffect(() => {
    if (data) {
      setName(data.name);
      setId(data.id);
    }
  }, [data]);

  // Handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameChanged(true);
  };

  // Handle the user update
  const { mutate: mutateUser } = useMutation({
    mutationFn: (userId: number) => updateUser(userId, { name: name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });

  // Handle the user update - API call
  useEffect(() => {
    if (id && nameChanged && debouncedName != data?.name) {
      mutateUser(id);
      setNameChanged(false);
    }
  }, [mutateUser, debouncedName, id, data?.name, nameChanged]);

  // Handle reset with email and password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!data?.email) {
      setError("Email address is missing.");
      setLoading(false);
      return;
    }

    const actionCodeSettings: ActionCodeSettings = {
      url: `${NEXT_PUBLIC_WEB_URL}/auth/reset`,
      handleCodeInApp: true,
    };

    try {
      await sendPasswordResetEmail(auth, data?.email, actionCodeSettings);

      toast.success("Reset link sent! Check your email.", {
        className: "bg-neutral-300 border-2 border-neutral-800 rounded-xl",
        progressClassName: "bg-green-500",
        autoClose: 2000,
        position: "bottom-center",
      });
    } catch (error) {
      console.error("Error sending reset email", error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Handle loading and error states
  if (isLoading) {
    return <Loading size={40} />;
  }
  if (fetchError) {
    console.error(fetchError || "Error fetching user info");
    return <Error />;
  }

  return (
    <section>
      <h1 className="mb-4">Personal</h1>

      <div className="flex w-full flex-col items-center justify-center gap-4 rounded-xl border border-neutral-800 p-4">
        <div className="flex w-full justify-between border-b border-neutral-400">
          <p className="font-semibold">Name</p>
          <input
            className="font-inter focus:font-mali text-end hover:cursor-pointer focus:cursor-text focus:pl-2 focus:text-start"
            value={name}
            onChange={handleNameChange}
          />
        </div>

        <div className="flex w-full justify-between border-b border-neutral-400">
          <p className="font-semibold">Email</p>
          <p>{data?.email}</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex w-full items-center justify-center rounded-full border border-transparent bg-neutral-100 py-2 font-semibold hover:border-neutral-800 hover:bg-neutral-200"
        >
          {loading ? "Sending link..." : "Change password"}
        </button>

        {error && <p className="text-center text-sm text-red-500">{error}</p>}
      </div>
    </section>
  );
}

export default Personal;
