"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";

import {
  acceptInvite,
  acceptInviteAuthenticated,
} from "@/lib/api/invite.api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";


export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center text-sm text-muted-foreground">
          Loading invite...
        </div>
      }
    >
      <AcceptInviteContent />
    </Suspense>
  );
}

function AcceptInviteContent() {
  const params = useSearchParams();
  const token = params.get("token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [orgName, setOrgName] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setIsCheckingAuth(false);
  }, []);  
    

  const mutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Invalid invite");

      if (isLoggedIn) {
        return acceptInviteAuthenticated({ token });
      }

      if (!email || !password) {
        throw new Error("Email and password required");
      }

      return acceptInvite({ token, email, password });
    },

    onSuccess: (data) => {
        if (!data?.token) {
            toast.error("Invalid response from server");
            return;
        }

        // Save token
        localStorage.setItem("token", data.token);

        //  FIX: merge instead of replace
        const existingUser = JSON.parse(localStorage.getItem("user") || "{}");

        const updatedUser = {
            ...existingUser, // keep old fields like orgName
            ...data.user,    // override orgId, role, permissions
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        toast.success("Joined organization");

        // IMPORTANT: full reload (not router push)
        setTimeout(() => {
            window.location.href = "/dashboard";
        }, 600);
    },

    onError: (err) => {
        console.log("Invite error:", err);
        toast.error(err?.message || "Failed to join");
    },
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setOrgName(user?.orgName || null);
  }, []);


  if (isCheckingAuth) return null;

  
  return (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-zinc-100 via-white to-emerald-50 relative overflow-hidden">

    {/*  Background effects */}
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.15),transparent_40%)]" />
    <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-emerald-200/30 rounded-full blur-3xl -z-10" />

    {/*  PREMIUM NAVBAR */}
    <div className="w-full sticky top-0 z-20 backdrop-blur-md bg-white/70 border-b border-zinc-200/60">

    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">

        {/* Icon */}
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-bold">H</span>
        </div>

        {/* Text */}
        <span className="text-sm sm:text-base font-semibold tracking-tight text-zinc-900">
            HireFlow
        </span>
        </div>

        {/* Right side badge */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-600 bg-white/70 border border-zinc-200 px-3 py-1.5 rounded-full shadow-sm">

        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />

        Secure Invite

        </div>

    </div>

    </div>

    {/*  MAIN CONTENT */}
    <div className="flex-1 flex items-center justify-center px-4">

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-10 items-center">

        {/*  LEFT SIDE */}
        <div className="hidden md:flex flex-col gap-6 animate-fadeIn fill-mode-both">

          <div>
            <h1 className="text-4xl font-bold text-zinc-900 leading-tight">
              Join your team on{" "}
              <span className="text-emerald-600">HireFlow</span>
            </h1>

            <p className="mt-3 text-zinc-600 text-sm leading-relaxed max-w-md">
              You’ve been invited to collaborate. Manage hiring workflows,
              track candidates, and streamline recruitment — all in one place.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4 text-sm text-zinc-600">

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 bg-emerald-500 rounded-full" />
              <span>Post and manage job openings effortlessly</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 bg-emerald-500 rounded-full" />
              <span>Track candidates across hiring stages</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 bg-emerald-500 rounded-full" />
              <span>Collaborate with your hiring team in real-time</span>
            </div>

          </div>

        </div>

        {/*  RIGHT CARD */}
        <div className="w-full animate-scaleIn fill-mode-both">

          <Card className="rounded-2xl sm:rounded-3xl border border-zinc-200 shadow-xl sm:shadow-2xl backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8 space-y-6">

              {/* Branding */}
              <div className="text-center space-y-1 animate-fadeIn delay-100 fill-mode-both">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
                  HireFlow
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500">
                  Hiring made simple
                </p>
              </div>

              {/* Invite Info */}
              <div className="text-center space-y-2 animate-fadeIn delay-200 fill-mode-both">

                <p className="text-sm text-zinc-500">
                  You’re invited to join
                </p>

                <h1 className="text-lg sm:text-xl font-semibold text-emerald-600 break-words">
                  {orgName || "HireFlow Workspace"}
                </h1>

                <p className="text-xs sm:text-sm text-zinc-500">
                  Accept your invite and start collaborating
                </p>

              </div>

              {/* Inputs */}
              {!isLoggedIn && (
                <div className="space-y-3 animate-fadeIn delay-300 fill-mode-both">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl h-10 sm:h-11"
                  />

                  <Input
                    type="password"
                    placeholder="Create a password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl h-10 sm:h-11"
                  />
                </div>
              )}

              {/* Info Box */}
              <div className="text-xs text-zinc-500 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-center leading-relaxed animate-fadeIn delay-200 fill-mode-both">
                You’ll be able to manage jobs, track candidates, and collaborate with your team.
              </div>

              {/* Button */}
              <Button
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
                className="w-full rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200 shadow-md h-10 sm:h-11 animate-fadeIn delay-300 fill-mode-both"
              >
                {mutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Joining...
                  </span>
                ) : (
                  "Join Organization"
                )}
              </Button>

              {/* Footer note */}
              <p className="text-[10px] sm:text-[11px] text-center text-zinc-400 animate-fadeIn delay-300 fill-mode-both">
                Secure invite • Powered by HireFlow
              </p>

            </CardContent>
          </Card>

        </div>

      </div>

    </div>

    {/*  FOOTER */}
    <div className="w-full text-center py-4 text-[11px] text-zinc-400">
      © {new Date().getFullYear()} HireFlow • All rights reserved
    </div>

  </div>
);
}