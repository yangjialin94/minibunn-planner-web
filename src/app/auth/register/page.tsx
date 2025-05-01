"use client";

import clsx from "clsx";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchUser } from "@/api/user";
import { auth } from "@/auth/firebaseClient"; // Handle sign in with email and password
import { usePageStore } from "@/hooks/usePageStore";
import { useUserStore } from "@/hooks/useUserStore";

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

  const setName = useUserStore((state) => state.setName);
  const setEmail = useUserStore((state) => state.setEmail);

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
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = await fetchUser();

      // Set user details in the store
      setName(user.name);
      setEmail(user.email);

      if (user.is_subscribed) {
        router.push("/calendar");
      } else {
        router.push("/auth/subscribe");
      }
    } catch (error) {
      console.error("Error with Google register", error);
      setErrors({ ...errors, firebaseError: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="centered-container">
      <div className="mx-auto flex w-full max-w-xs flex-col items-center text-center">
        {/* Logo */}
        <div className="relative mb-4 h-12 w-12">
          <Image
            src="/minibunn-logo.svg"
            alt="Minibunn icon"
            fill
            sizes="40px"
            className="object-contain"
            priority
          />
        </div>

        {/* Title & Description */}
        <h1 className="mb-4 text-2xl font-bold">Create new account</h1>
        <p className="mb-2 text-neutral-500">
          Enter your email and password to register new account.
        </p>
        <p className="mb-8 text-neutral-500">
          Already have an account?{" "}
          <Link
            href="/"
            passHref
            className="font-semibold text-neutral-500 underline-offset-8 hover:text-neutral-800 hover:underline"
          >
            Sign in
          </Link>
        </p>

        {/* Register Form */}
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
      </div>
    </div>
  );
}

export default RegisterPage;
