"use client";

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { getJobs } from "@/lib/api/jobs.api"
import { getAllCandidates } from "@/lib/api/candidates.api"

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {

  const { data, isLoading, error } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  })

  const { data: candidateData } = useQuery({
    queryKey: ["candidates"],
    queryFn: getAllCandidates,
  })

  const jobs = data?.data || []
  const totalJobs = jobs.length

  const candidates = candidateData?.data || []
  const totalCandidates = candidates.length

  const applied = candidates.filter(c => c.status === "APPLIED").length

  const scoredCandidates = candidates.filter(c => c.bestScore !== null)
  const withScores = scoredCandidates.length

  const avgScore =
    withScores > 0
      ? (
        scoredCandidates.reduce((acc, c) => acc + c.bestScore, 0) /
        withScores
      ).toFixed(1)
      : 0

  const activeJobs = jobs.filter(
    j => j.status?.toLowerCase() === "open"
  ).length

  const last7Days = new Date()
  last7Days.setDate(last7Days.getDate() - 7)

  const recentJobsCount = jobs.filter(
    j => new Date(j.createdAt) > last7Days
  ).length

  if (error) return <p className="text-red-500 p-6">{error.message}</p>

  // 🔥 EARLY SKELETON RETURN
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-100">
        <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-40 bg-zinc-300/60 animate-pulse" />
              <Skeleton className="h-4 w-64 bg-zinc-300/60 animate-pulse" />
            </div>
            <Skeleton className="h-10 w-32 rounded-xl  bg-zinc-300/60 animate-pulse" />
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-3">
            {[1,2,3].map(i => (
              <Skeleton key={i} className="h-28 rounded-3xl bg-zinc-300/60 animate-pulse" />
            ))}
          </div>

          {/* Actions */}
          <Skeleton className="h-40 rounded-3xl bg-zinc-300/60 animate-pulse" />

          {/* Insights */}
          <Skeleton className="h-52 rounded-3xl bg-zinc-300/60 animate-pulse" />

          {/* Jobs */}
          <Skeleton className="h-60 rounded-3xl bg-zinc-300/60 animate-pulse" />

        </main>
      </div>
    )
  }

  return (
  <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/40 to-indigo-50/40">

    <main
      className="
        max-w-6xl mx-auto px-6 py-10 space-y-10
        relative
        bg-white/70 backdrop-blur-xl
        border border-zinc-200/60
        rounded-3xl
        shadow-[0_20px_60px_rgba(0,0,0,0.06)]
      "
    >
      {/* subtle cool glow */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-indigo-400/10 blur-3xl rounded-full pointer-events-none" />

      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between">

        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Overview
          </h1>

          <p className="text-sm text-zinc-500 mt-1">
            {totalJobs === 0
              ? "Start by creating your first job"
              : "Track your hiring activity and progress"}
          </p>
        </div>

        <Link href="/dashboard/jobs/new">
          <Button
            className="
              rounded-full px-5 h-10
              bg-zinc-900 hover:bg-zinc-800
              text-white shadow-sm
              transition-all hover:scale-[1.03]
            "
          >
            + Create Job
          </Button>
        </Link>
      </div>

      {/* 🔥 EMPTY STATE */}
      {totalJobs === 0 && (
        <div className="
          flex flex-col items-center justify-center text-center
          py-16 space-y-5
          rounded-3xl
          border border-dashed border-blue-200
          bg-gradient-to-br from-blue-50/60 to-white
        ">
          <div className="text-4xl">🚀</div>

          <div className="space-y-1">
            <p className="text-lg font-semibold text-zinc-800">
              Start your hiring journey
            </p>
            <p className="text-sm text-zinc-500">
              Create your first job and begin receiving candidates
            </p>
          </div>

          <Link href="/dashboard/jobs/new">
            <Button className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-full px-6">
              Create your first job
            </Button>
          </Link>
        </div>
      )}

      {/* 🔥 CONTENT (ONLY IF JOBS EXIST) */}
      {totalJobs > 0 && (
        <>
          {/* STATS */}
          <div className="grid gap-6 md:grid-cols-3">

            <Card className="
              rounded-3xl
              bg-gradient-to-br from-blue-50 to-white
              border border-blue-200
              shadow-[0_15px_40px_rgba(59,130,246,0.15)]
              p-6
            ">
              <CardDescription>Total Jobs</CardDescription>
              <CardTitle className="text-4xl mt-2 text-blue-700">
                {totalJobs}
              </CardTitle>
            </Card>

            <Card className="rounded-3xl bg-white border border-zinc-200 shadow-sm p-6 transition hover:shadow-md">
              <CardDescription>Active Jobs</CardDescription>
              <CardTitle className="text-4xl mt-2">{activeJobs}</CardTitle>
            </Card>

            <Card className="rounded-3xl bg-white border border-zinc-200 shadow-sm p-6 transition hover:shadow-md">
              <CardDescription>New This Week</CardDescription>
              <CardTitle className="text-4xl mt-2">{recentJobsCount}</CardTitle>
            </Card>

          </div>

          {/* 🔥 PRIMARY ACTION */}
          <Card className="
            rounded-3xl
            bg-gradient-to-br from-blue-50/60 to-white
            border border-blue-200/60
            shadow-[0_20px_60px_rgba(59,130,246,0.08)]
            p-6
          ">

            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-xl">
                What do you want to do today?
              </CardTitle>
              <CardDescription>
                Quickly jump into your hiring workflow
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0 grid gap-4 md:grid-cols-3">

              {/* NORMAL */}
              <Link href="/dashboard/jobs/new">
                <div className="
                  group rounded-2xl border border-zinc-200/50
                  p-5 cursor-pointer
                  bg-white/80 backdrop-blur-sm
                  transition-all duration-200
                  hover:shadow-md hover:-translate-y-1
                ">
                  <p className="font-medium">Create a new job</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Start collecting candidates instantly
                  </p>
                </div>
              </Link>

              {/* ⭐ HERO ACTION */}
              <Link href="/dashboard/jobs">
                <div className="
                  group rounded-2xl
                  p-5 cursor-pointer

                  bg-gradient-to-br from-blue-50/80 to-indigo-50/60
                  border border-blue-200/60

                  shadow-[0_10px_30px_rgba(59,130,246,0.12)]

                  transition-all duration-200
                  hover:shadow-[0_15px_40px_rgba(59,130,246,0.18)]
                  hover:-translate-y-[2px]
                ">
                  <p className="font-semibold text-blue-900">
                    Review candidates
                  </p>

                  <p className="text-sm text-blue-700/80 mt-1">
                    Check applications and shortlist
                  </p>

                  <div className="mt-3 text-blue-600 group-hover:translate-x-1 transition">
                    →
                  </div>
                </div>
              </Link>

              {/* NORMAL */}
              <Link href="/dashboard/jobs">
                <div className="
                  group rounded-2xl border border-zinc-200/50
                  p-5 cursor-pointer
                  bg-white/80 backdrop-blur-sm
                  transition-all duration-200
                  hover:shadow-md hover:-translate-y-1
                ">
                  <p className="font-medium">View hiring pipeline</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Track candidates across stages
                  </p>
                </div>
              </Link>

            </CardContent>
          </Card>
        </>
      )}

      {/* 🔥 INSIGHTS */}
      <Card className="
        rounded-3xl
        bg-gradient-to-br from-indigo-50/40 to-white
        border border-indigo-200/50
        shadow-[0_15px_40px_rgba(99,102,241,0.08)]
        p-6
      ">

        <CardHeader className="px-0 pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              🧠 Candidate Insights
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                AI Powered
              </span>
            </CardTitle>

            <CardDescription>
              AI-powered hiring signals across all jobs
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-0 space-y-6">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Total", value: totalCandidates },
              { label: "Applied", value: applied },
              { label: "Scored", value: withScores },
              { label: "Avg Score", value: avgScore },
            ].map((item, i) => (
              <div
                key={i}
                className="
                  p-3 rounded-xl
                  bg-white/70 border border-zinc-200/50
                  transition hover:shadow-sm hover:-translate-y-[2px]
                "
              >
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="
            rounded-xl px-4 py-3 text-sm
            bg-white/80 border border-indigo-100
            text-muted-foreground
          ">
            {totalCandidates === 0 && (
              "No candidates yet. Share your job link to start receiving applications."
            )}

            {totalCandidates > 0 && withScores === 0 && (
              "Candidates are coming in, but resumes are still being processed."
            )}

            {withScores > 0 && avgScore < 50 && (
              "Candidate quality is low — consider improving your job description."
            )}

            {withScores > 0 && avgScore >= 50 && (
              "You're getting strong candidates. Focus on top matches to speed up hiring."
            )}
          </div>

        </CardContent>
      </Card>

      {/* 🔥 RECENT JOBS */}
      {totalJobs > 0 && (
        <Card className="
          rounded-3xl
          bg-white/80 backdrop-blur-md
          border border-zinc-200/60
          shadow-[0_10px_30px_rgba(0,0,0,0.05)]
          p-6
        ">

          <CardHeader className="px-0 pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                Recent Jobs
              </CardTitle>
              <CardDescription>
                Your latest job postings
              </CardDescription>
            </div>

            <Link href="/dashboard/jobs">
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="px-0 space-y-3">

            {jobs.slice(0, 5).map((job) => (
              <Link
                key={job.id}
                href={`/dashboard/jobs/${job.id}`}
                className="
                  group flex items-center justify-between
                  rounded-xl px-4 py-4
                  transition-all
                  hover:bg-blue-50/40
                  hover:shadow-md
                  hover:-translate-y-[2px]
                "
              >
                <div className="space-y-1">
                  <p className="font-medium group-hover:underline">
                    {job.title}
                  </p>

                  {job.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {job.description}
                    </p>
                  )}
                </div>

                <span className="text-sm text-muted-foreground group-hover:translate-x-1 transition">
                  →
                </span>
              </Link>
            ))}

          </CardContent>
        </Card>
      )}

    </main>
  </div>
)
}