"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/dashboard");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-zinc-50 to-white text-zinc-900">

      {/* 🔥 NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-zinc-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <h1 className="font-semibold text-lg tracking-tight">
            HireFlow
          </h1>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>

            <Button
              onClick={() => router.push("/register")}
              className="
                rounded-full px-5 
                bg-gradient-to-r from-purple-600 to-indigo-600 
                text-white shadow-md
                hover:scale-[1.05] hover:shadow-xl
                transition-all duration-300
              "
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* 🔥 HERO */}
      <section className="relative px-6 py-20 sm:py-24 md:py-28 text-center overflow-hidden">

        {/* 💜 GRADIENT GLOW */}
        <div className="absolute inset-0 flex justify-center pointer-events-none">
          <div className="w-[700px] h-[700px] bg-purple-400/20 blur-[140px] rounded-full" />
        </div>

        <div className="relative max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Hire smarter with{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              AI-powered recruiting
            </span>
          </h1>

          <p className="text-zinc-600 text-lg">
            Extract skills, analyze resumes, and identify top candidates in seconds —
            all in one streamlined workflow.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button
              onClick={() => router.push("/register")}
              className="
                rounded-full px-7 py-3 text-white 
                bg-gradient-to-r from-purple-600 to-indigo-600 
                shadow-lg
                hover:scale-[1.05] hover:shadow-xl
                transition-all duration-300
              "
            >
              Get Started
            </Button>

            <Button
              variant="outline"
              className="rounded-full px-7 py-3 border-zinc-300"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          </div>

          {/* 🧠 FAKE DASHBOARD PREVIEW */}
          <div className="mt-12 sm:mt-16 max-w-3xl md:max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="
              rounded-2xl border border-zinc-200/60 
              bg-white/60 backdrop-blur-xl 
              shadow-xl p-6
            ">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-300" />
                <div className="w-3 h-3 rounded-full bg-yellow-300" />
                <div className="w-3 h-3 rounded-full bg-green-300" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="h-20 rounded-xl bg-purple-100/60" />
                <div className="h-20 rounded-xl bg-indigo-100/60" />
                <div className="h-20 rounded-xl bg-blue-100/60" />
              </div>

              <div className="mt-4 h-32 rounded-xl bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center text-zinc-500 text-sm">
                AI Candidate Insights Dashboard
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 🔥 FEATURES */}
     <section className="px-6 py-24 max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
  {[
    {
      title: "AI Resume Parsing",
      desc: "Extract skills, experience, and insights instantly from resumes",
      color: "from-purple-500/10 to-transparent",
    },
    {
      title: "Smart Candidate Matching",
      desc: "Automatically rank and identify the best candidates",
      color: "from-indigo-500/10 to-transparent",
    },
    {
      title: "Centralized Hiring",
      desc: "Manage jobs and candidates in one powerful dashboard",
      color: "from-blue-500/10 to-transparent",
    },
  ].map((item, i) => (
    <div
      key={i}
      className="
        relative p-6 rounded-2xl 
        border border-zinc-200/60 
        bg-white/60 backdrop-blur-xl
        shadow-sm hover:shadow-xl
        transition-all duration-300 hover:-translate-y-1
        overflow-hidden
      "
    >
      {/* subtle gradient layer */}
      <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />

      <div className="relative space-y-2">
        <h3 className="font-semibold text-zinc-900">
          {item.title}
        </h3>
        <p className="text-sm text-zinc-500">
          {item.desc}
        </p>
      </div>
    </div>
  ))}
</section>

      {/* 🔥 HOW IT WORKS */}
     <section className="px-6 py-24 text-center space-y-12">
  <h2 className="text-2xl font-semibold">
    How it works
  </h2>

  <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
    {[
      {
        step: "Create a job",
        desc: "Define your hiring needs",
      },
      {
        step: "Upload candidates",
        desc: "Add resumes effortlessly",
      },
      {
        step: "Get insights",
        desc: "AI ranks candidates instantly",
      },
    ].map((item, i) => (
      <div
        key={i}
        className="
          relative p-6 rounded-xl 
          bg-white/60 backdrop-blur-xl 
          border border-zinc-200/60
          shadow-sm 
          transition-all duration-300 
          hover:-translate-y-1 hover:shadow-xl
        "
      >
        {/* step number */}
        <div className="
          absolute -top-3 left-4
          text-xs font-medium px-2 py-1
          rounded-full
          bg-gradient-to-r from-purple-600 to-indigo-600
          text-white shadow
        ">
          Step {i + 1}
        </div>

        <p className="font-medium mt-2">
          {item.step}
        </p>
        <p className="text-sm text-zinc-500 mt-2">
          {item.desc}
        </p>
      </div>
    ))}
  </div>
</section>
      {/* 🔥 FINAL CTA */}
      <section className="px-6 py-28 text-center space-y-6">
        <h2 className="text-3xl font-semibold">
          Start hiring smarter today
        </h2>

        <p className="text-zinc-600">
          Join HireFlow and simplify your hiring workflow with AI.
        </p>

        <Button
          onClick={() => router.push("/register")}
          className="
            rounded-full px-8 py-3 text-white 
            bg-gradient-to-r from-purple-600 to-indigo-600 
            shadow-lg
            hover:scale-[1.05] hover:shadow-xl
            transition-all duration-300
          "
        >
          Create your account
        </Button>
      </section>

      <footer className="border-t border-zinc-200 bg-white/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-12">

          {/* TOP */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* BRAND */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight">
                HireFlow
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed">
                AI-powered recruiting platform to streamline hiring,
                analyze candidates, and make smarter decisions.
              </p>
            </div>

            {/* PRODUCT */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-zinc-800">Product</p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li className="hover:text-zinc-900 cursor-pointer">Features</li>
                <li className="hover:text-zinc-900 cursor-pointer">Pricing</li>
                <li className="hover:text-zinc-900 cursor-pointer">Integrations</li>
              </ul>
            </div>

            {/* COMPANY */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-zinc-800">Company</p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li className="hover:text-zinc-900 cursor-pointer">About</li>
                <li className="hover:text-zinc-900 cursor-pointer">Careers</li>
                <li className="hover:text-zinc-900 cursor-pointer">Contact</li>
              </ul>
            </div>

            {/* LEGAL */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-zinc-800">Legal</p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li className="hover:text-zinc-900 cursor-pointer">Privacy Policy</li>
                <li className="hover:text-zinc-900 cursor-pointer">Terms of Service</li>
              </ul>
            </div>

          </div>

          {/* BOTTOM */}
          <div className="mt-10 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-center gap-4">

            <p className="text-xs text-zinc-500">
              © {new Date().getFullYear()} HireFlow. All rights reserved.
            </p>

            <div className="flex items-center gap-4 text-sm text-zinc-500">
              <span className="hover:text-zinc-900 cursor-pointer">Twitter</span>
              <span className="hover:text-zinc-900 cursor-pointer">LinkedIn</span>
              <span className="hover:text-zinc-900 cursor-pointer">GitHub</span>
            </div>

          </div>

        </div>
      </footer>
    </div>
  );
}