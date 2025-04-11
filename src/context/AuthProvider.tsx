"use client";

import { useQueryClient } from "@tanstack/react-query";
import { onIdTokenChanged, signOut, User as FirebaseUser } from "firebase/auth";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, ReactNode, useEffect, useState } from "react";

import { auth } from "@/auth/firebaseClient";

// Maximum session duration in days
const SESSION_DURATION_DAYS = 7;

interface AuthContextType {
  user: FirebaseUser | null;
}

// Create a context for authentication with the proper type
export const AuthContext = createContext<AuthContextType>({ user: null });

/**
 * AuthProvider component to provide auth context
 */
function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [user, setUser] = useState<FirebaseUser | null>(null);

  // Effect to handle user authentication state
  useEffect(() => {
    // Set the session start time
    let sessionStart = localStorage.getItem("sessionStart");
    if (!sessionStart) {
      sessionStart = Date.now().toString();
      localStorage.setItem("sessionStart", Date.now().toString());
    }

    // Listen for changes in the ID token
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is authenticated

        // Calculate the session duration
        const now = Date.now();
        const sessionStartTimestamp = parseInt(sessionStart, 10);
        const sessionDurationMs = now - sessionStartTimestamp;
        const maxDurationMs = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

        if (sessionDurationMs > maxDurationMs) {
          // Session expired

          // Sign out the user
          await signOut(auth);

          // Remove the token and session start time
          Cookies.remove("token");
          localStorage.removeItem("sessionStart");
          setUser(null);

          // Redirect to home
          router.push("/");

          console.warn("Session expired.");
          return;
        }

        // Update the token
        const token = await firebaseUser.getIdToken();
        Cookies.set("token", token, { expires: SESSION_DURATION_DAYS });
        setUser(firebaseUser);

        // Invalidate queries to refresh data
        queryClient.invalidateQueries();
      } else {
        // User is not authenticated

        // Remove the token and session start time
        Cookies.remove("token");
        localStorage.removeItem("sessionStart");
        setUser(null);

        // Redirect to home
        router.push("/");

        console.warn("Session expired.");
      }
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [queryClient, router]);

  // Redirect to home if no token and on a protected route
  useEffect(() => {
    const token = Cookies.get("token");
    console.log("Token:", token);
    const isProtectedRoute = pathname === "/" || pathname.startsWith("/auth");

    if (
      typeof window !== "undefined" &&
      !token &&
      !isProtectedRoute &&
      pathname !== "/"
    ) {
      console.warn("No token — redirecting to home");
      router.push("/");
    }
  }, [pathname, router, user]);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
