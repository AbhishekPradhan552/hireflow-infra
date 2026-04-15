"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("RECRUITER");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, role})
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form
      onSubmit={handleSubmit}
      className="
        space-y-5 sm:space-y-6
        animate-in fade-in slide-in-from-bottom-4 duration-500
      "
    >

      {/* HEADER */}
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-semibold text-zinc-900">
          Create your account
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500">
          Start hiring smarter with AI
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="
          text-sm text-red-600
          bg-red-50 border border-red-200
          px-3 py-2 rounded-lg
        ">
          {error}
        </div>
      )}

      {/* EMAIL */}
      <Input
        type="email"
        placeholder="Work email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="
          h-10 sm:h-11 rounded-xl
          bg-white/80 backdrop-blur
          border border-zinc-200
          focus-visible:ring-2 focus-visible:ring-purple-200
          focus-visible:border-purple-400
          transition
        "
      />

      {/* PASSWORD */}
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="
            h-10 sm:h-11 rounded-xl pr-12
            bg-white/80 backdrop-blur
            border border-zinc-200
            focus-visible:ring-2 focus-visible:ring-purple-200
            focus-visible:border-purple-400
            transition
          "
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            text-xs font-medium
            text-zinc-500 hover:text-zinc-800
          "
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      {/* PASSWORD HINT */}
      <p className="text-xs text-zinc-500 -mt-2 sm:-mt-3">
        Use at least 6 characters
      </p>

      {/* ROLE */}
      <div className="space-y-3">
        <p className="text-sm text-zinc-600">Choose your role</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {/* RECRUITER */}
          <button
            type="button"
            onClick={() => setRole("RECRUITER")}
            className={`
              text-left rounded-2xl p-3 sm:p-4 border transition-all duration-200
              ${
                role === "RECRUITER"
                  ? "border-purple-500 bg-purple-50/70 shadow-[0_8px_25px_rgba(99,102,241,0.15)]"
                  : "border-zinc-200/60 bg-white/70 hover:bg-white hover:shadow-[0_6px_18px_rgba(0,0,0,0.06)]"
              }
            `}
          >
            <p className="font-medium text-sm text-zinc-800">Recruiter</p>
            <p className="text-xs text-zinc-500 mt-1">
              Manage candidates and view jobs
            </p>
          </button>

          {/* VIEWER */}
          <button
            type="button"
            onClick={() => setRole("VIEWER")}
            className={`
              text-left rounded-2xl p-3 sm:p-4 border transition-all duration-200
              ${
                role === "VIEWER"
                  ? "border-purple-500 bg-purple-50/70 shadow-[0_8px_25px_rgba(99,102,241,0.15)]"
                  : "border-zinc-200/60 bg-white/70 hover:bg-white hover:shadow-[0_6px_18px_rgba(0,0,0,0.06)]"
              }
            `}
          >
            <p className="font-medium text-sm text-zinc-800">Viewer</p>
            <p className="text-xs text-zinc-500 mt-1">
              Read-only access to jobs and candidates
            </p>
          </button>

        </div>
      </div>

      {/* CTA */}
      <Button
        type="submit"
        disabled={loading}
        className="
          w-full h-10 sm:h-11 rounded-xl font-medium
          bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600
          bg-[length:200%_100%]
          text-white
          shadow-md hover:shadow-xl
          transition-all duration-300
          hover:scale-[1.02]
          hover:bg-right
          active:scale-[0.98]
        "
      >
        {loading ? "Creating account..." : "Create account"}
      </Button>

      {/* FOOT */}
      <p className="text-xs text-center text-zinc-500">
        Already have an account?{" "}
        <span
          onClick={() => router.push("/login")}
          className="text-indigo-600 hover:underline cursor-pointer"
        >
          Sign in
        </span>
      </p>

    </form>
  </div>
    
  );
}