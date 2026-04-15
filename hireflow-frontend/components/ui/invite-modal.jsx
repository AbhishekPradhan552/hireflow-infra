"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createInvite } from "@/lib/api/invite.api";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InviteModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("RECRUITER");
  const [inviteLink, setInviteLink] = useState("");

  const mutation = useMutation({
    mutationFn: createInvite,
    onSuccess: (data) => {
      setInviteLink(data.inviteUrl);
      toast.success("Invite link generated");
    },
    onError: () => {
      toast.error("Failed to create invite");
    },
  });

  const handleInvite = () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }
    mutation.mutate({ email, role });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
        className="
            w-[92vw] sm:max-w-md

            rounded-3xl
            border border-zinc-200/60
            bg-white

            shadow-[0_40px_100px_rgba(0,0,0,0.18)]

            p-6 sm:p-7

            animate-scaleIn fill-mode-both

            max-h-[90vh] overflow-y-auto
        "
        >
        {/* HEADER */}
        <DialogHeader className="space-y-3 text-center">

            {/* Icon */}
            <div className="mx-auto w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-semibold">+</span>
            </div>

            <DialogTitle className="text-xl font-semibold text-zinc-900">
            Invite Team Member
            </DialogTitle>

            <p className="text-sm text-zinc-500 max-w-xs mx-auto">
            Add someone to your workspace and collaborate instantly
            </p>
        </DialogHeader>

        <div className="space-y-5 mt-5">

            {/* EMAIL */}
            <div className="space-y-2 animate-fadeIn delay-100 fill-mode-both">
            <label className="text-sm font-medium text-zinc-700">
                Email address
            </label>

            <Input
                placeholder="john@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl h-11 focus:ring-2 focus:ring-emerald-500"
            />
            </div>

            {/* ROLE */}
            <div className="space-y-2 animate-fadeIn delay-200 fill-mode-both">
            <label className="text-sm font-medium text-zinc-700">
                Role
            </label>

            <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="rounded-xl h-11 px-3 focus:ring-2 focus:ring-emerald-500">
                <SelectValue />
                </SelectTrigger>

                <SelectContent
                side="bottom"
                align="start"
                sideOffset={8}
                position="popper"
                className="
                    rounded-xl
                    border border-zinc-200
                    bg-white
                    shadow-[0_20px_50px_rgba(0,0,0,0.18)]
                    p-1
                "
                >
                <SelectItem
                    value="RECRUITER"
                    className="rounded-lg px-3 py-2 focus:bg-emerald-50 cursor-pointer"
                >
                    <div className="flex flex-col leading-tight">
                    <span className="font-medium text-zinc-900">
                        Recruiter
                    </span>
                    <span className="text-xs text-muted-foreground">
                        Can manage jobs & candidates
                    </span>
                    </div>
                </SelectItem>

                <SelectItem
                    value="VIEWER"
                    className="rounded-lg px-3 py-2 focus:bg-emerald-50 cursor-pointer"
                >
                    <div className="flex flex-col leading-tight">
                    <span className="font-medium text-zinc-900">
                        Viewer
                    </span>
                    <span className="text-xs text-muted-foreground">
                        Read-only access
                    </span>
                    </div>
                </SelectItem>
                </SelectContent>
            </Select>
            </div>

            {/* INFO BOX */}
            <div
            className="
                rounded-xl 
                bg-emerald-50/60 
                border border-emerald-100 
                px-3 py-2 
                text-xs text-emerald-700
                animate-fadeIn delay-200 fill-mode-both
            "
            >
            A secure invite link will be generated and can be shared instantly.
            </div>

            {/* BUTTON */}
            <Button
            onClick={handleInvite}
            disabled={mutation.isPending}
            className="
                w-full h-11 rounded-full 
                bg-emerald-600 text-white 
                hover:bg-emerald-700
                shadow-md hover:shadow-lg
                transition-all duration-200
                animate-fadeIn delay-300 fill-mode-both
            "
            >
            {mutation.isPending ? "Generating..." : "Generate Invite Link"}
            </Button>

            {/* RESULT */}
            {inviteLink && (
            <div className="space-y-3 pt-4 border-t border-zinc-100 animate-fadeIn fill-mode-both">

                <p className="text-xs font-medium text-zinc-500">
                Invite link
                </p>

                <div className="flex gap-2">
                <Input value={inviteLink} readOnly className="rounded-xl text-xs" />

                <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                    navigator.clipboard.writeText(inviteLink);
                    toast.success("Copied to clipboard");
                    }}
                >
                    Copy
                </Button>
                </div>

            </div>
            )}
        </div>
        </DialogContent>
    </Dialog>
  );
}