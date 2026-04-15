"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createJob } from "@/lib/api/jobs.api";

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function CreateJobPage() {
  const router = useRouter();
  const queryClient = useQueryClient()
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createMutation = useMutation({
    mutationFn: createJob,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      toast.success("Job created successfully")
      router.push(`/dashboard/jobs/${data.job.id}`)
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create job")
    }
  })

  function handleSubmit(e) {
    e.preventDefault()
    createMutation.mutate({ title, description, requiredSkills:[] })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/40 via-white to-blue-50/40">
      <div className="p-6 max-w-6xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          {/* LEFT */}
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Create Job
            </h1>

            <p className="text-sm text-zinc-500">
              Define the role and start receiving candidates
            </p>
          </div>

          {/* RIGHT ACTION */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-white/60 backdrop-blur transition"
          >
            Cancel
          </Button>

        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* LEFT: FORM */}
          <div className="md:col-span-2">
            <Card className="rounded-3xl bg-white/70 backdrop-blur-xl border border-zinc-200/60 shadow-[0_15px_50px_rgba(0,0,0,0.06)]">
              <CardContent className="p-6 space-y-8">

                <form onSubmit={handleSubmit} className="space-y-8">

                  {/* SECTION */}
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-zinc-900">
                      Role details
                    </p>
                    <p className="text-xs text-zinc-500">
                      This is what candidates will see first
                    </p>
                  </div>

                  {/* JOB TITLE */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">
                      Job Title
                    </label>

                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Backend Engineer"
                      className="
                        h-11 rounded-xl
                        bg-white/80
                        border border-zinc-200
                        focus-visible:ring-2 focus-visible:ring-blue-100
                        focus-visible:border-blue-400
                        transition
                      "
                      required
                    />

                    <p className="text-xs text-zinc-500">
                      This will be visible to candidates
                    </p>
                  </div>

                  {/* DESCRIPTION */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700">
                      Description
                    </label>

                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe responsibilities, requirements, and expectations..."
                      rows={5}
                      className="
                        rounded-xl min-h-[140px]
                        bg-white/80
                        border border-zinc-200
                        leading-relaxed
                        focus-visible:ring-2 focus-visible:ring-blue-100
                        focus-visible:border-blue-400
                        transition
                      "
                    />

                    <p className="text-xs text-zinc-500">
                      Tip: Mention skills, experience & tools (e.g. Node.js, AWS)
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="pt-4 flex items-center justify-end">

                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="
                        rounded-full px-7 py-2 font-medium
                        bg-gradient-to-r from-indigo-600 to-blue-600
                        text-white
                        shadow-md hover:shadow-lg
                        transition-all duration-200
                        hover:scale-[1.02]
                      "
                    >
                      {createMutation.isPending
                        ? "Creating..."
                        : "Create Job"}
                    </Button>

                  </div>

                </form>

              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-5">

            {/* PREVIEW (HERO) */}
            <Card className="
              rounded-3xl
              bg-gradient-to-br from-blue-50/80 to-indigo-50/60
              border border-blue-200/60
              shadow-[0_15px_50px_rgba(59,130,246,0.15)]
            ">
              <CardContent className="p-5 space-y-4">

                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-blue-900">
                    Preview
                  </p>

                  <span className="text-[10px] text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                    Live
                  </span>
                </div>

                <div className="border border-blue-200/60 rounded-xl p-4 bg-white/80 backdrop-blur">

                  {/* Title */}
                  <p className="font-semibold text-sm text-zinc-900">
                    {title || "Backend Engineer"}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                    <span>Full-time</span>
                    <span>•</span>
                    <span>Remote</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-zinc-600 leading-relaxed line-clamp-4">
                    {description ||
                      "We are looking for a skilled backend engineer to build scalable systems and APIs. You will work with modern technologies and collaborate with cross-functional teams."}
                  </p>

                  {/* CTA mock */}
                  <div className="pt-2">
                    <div className="text-[11px] text-zinc-600 border border-zinc-200 rounded-md px-2 py-1 inline-block bg-white">
                      Apply →
                    </div>
                  </div>

                </div>

              </CardContent>
            </Card>

            {/* TIPS */}
            <Card className="
              rounded-3xl
              bg-amber-50/70
              border border-amber-200/60
              shadow-sm
            ">
              <CardContent className="p-5 space-y-4">

                <p className="text-sm font-semibold text-amber-900 flex items-center gap-2">
                  💡 Improve candidate quality
                </p>

                <ul className="text-xs text-amber-800/80 space-y-3">

                  <li className="flex gap-2">
                    <span>✔️</span>
                    <span>
                      Use clear job titles{" "}
                      <span className="text-amber-700/70">
                        (Backend Engineer vs Developer)
                      </span>
                    </span>
                  </li>

                  <li className="flex gap-2">
                    <span>✔️</span>
                    <span>Mention required tech stack</span>
                  </li>

                  <li className="flex gap-2">
                    <span>✔️</span>
                    <span>Add experience expectations</span>
                  </li>

                  <li className="flex gap-2">
                    <span>✔️</span>
                    <span>Keep description concise</span>
                  </li>

                </ul>

              </CardContent>
            </Card>

            {/* WHAT NEXT */}
            <Card className="rounded-3xl bg-white/60 backdrop-blur-xl border border-zinc-200/60 shadow-sm">
              <CardContent className="p-5 space-y-2">

                <p className="text-sm font-semibold text-zinc-900">
                  🚀 What happens next?
                </p>

                <p className="text-xs text-zinc-500">
                  After creating this job, you can:
                </p>

                <ul className="text-xs text-zinc-500 space-y-1">
                  <li>• Share public apply link</li>
                  <li>• Track candidates in pipeline</li>
                  <li>• Get AI resume insights</li>
                </ul>

              </CardContent>
            </Card>

          </div>

        </div>

      </div>
    </div>
  )
}