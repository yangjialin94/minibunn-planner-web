"use client";

import clsx from "clsx";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { auth } from "@/auth/firebaseClient"; // Handle sign in with email and password
import { usePageStore } from "@/hooks/usePageStore";

/**
 * Register Page
 */
function RegisterPage() {
  const router = useRouter();
  const setPage = usePageStore((state) => state.setPage);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    firebaseError: "",
  });
  const [loading, setLoading] = useState(false);

  // Set the page to auth
  useEffect(() => {
    setPage("auth");
  }, [setPage]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "", firebaseError: "" });
  };

  // Handle register with email and password
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: "", password: "", firebaseError: "" });

    // Basic form validation
    if (!form.email || !form.password) {
      setErrors({
        ...errors,
        email: !form.email ? "Email is required." : "",
        password: !form.password ? "Password is required." : "",
      });
      return;
    }

    setLoading(true);

    try {
      // Create user with email and password and sign in
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      router.push("/calendar");
    } catch (error) {
      console.error("Error with Google register", error);
      setErrors({ ...errors, firebaseError: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center overflow-scroll">
      <div className="flex w-full max-w-xs flex-col items-center justify-center gap-4">
        <form
          onSubmit={handleRegister}
          className="flex w-full flex-col items-center space-y-4 rounded-xl border border-neutral-800 p-4"
        >
          <div className="flex w-full flex-col gap-2 border-b border-neutral-400">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={clsx(
                "w-full rounded-xl border px-4 py-2 outline-none",
                {
                  "border-transparent": !errors.email,
                  "border-red-500": errors.email,
                },
              )}
              required
            />
            {errors.email && (
              <p className="py-2 pl-4 text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="flex w-full flex-col gap-2 border-b border-neutral-400">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={clsx(
                "w-full rounded-xl border px-4 py-2 outline-none",
                {
                  "border-transparent": !errors.email,
                  "border-red-500": errors.email,
                },
              )}
              required
            />
            {errors.email && (
              <p className="py-2 pl-4 text-red-500">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-full border border-transparent bg-neutral-100 py-2 font-semibold hover:border-neutral-800 hover:bg-neutral-200"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {errors.firebaseError && (
            <p className="text-center text-sm text-red-500">
              {errors.firebaseError}
            </p>
          )}
        </form>
        <p className="font-semibold text-neutral-500">•</p>
        <Link
          className="flex w-full items-center justify-center rounded-full border border-transparent bg-neutral-100 py-2 font-semibold hover:border-neutral-800 hover:bg-neutral-200"
          href="/"
          passHref
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default RegisterPage;
