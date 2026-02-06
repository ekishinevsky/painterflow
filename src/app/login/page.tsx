"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [emailPlaceholder, setEmailPlaceholder] = useState("");
  const [passwordPlaceholder, setPasswordPlaceholder] = useState("");
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/app");
    }
  }, [user, loading, router]);

  // Typewriter effect for email placeholder
  useEffect(() => {
    const text = "write your email here";
    let index = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (index < text.length) {
          setEmailPlaceholder(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Typewriter effect for password placeholder
  useEffect(() => {
    const text = "write your password here";
    let index = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (index < text.length) {
          setPasswordPlaceholder(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setSubmitting(false);
    } else {
      router.push("/app");
    }
  };

  if (loading || user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.png"
            alt="Painterflow"
            width={64}
            height={64}
            className="h-16 w-16 object-contain rounded-xl"
          />
          <h1 className="mt-4 text-2xl font-bold text-center text-white">Log in to Painterflow</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={emailPlaceholder}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:font-mono placeholder:text-green-500/70"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={passwordPlaceholder}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:font-mono placeholder:text-green-500/70"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
