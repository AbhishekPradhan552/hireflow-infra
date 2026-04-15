
"use client"

import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { getJobById, deleteJob, getJobStats } from "@/lib/api/jobs.api"
import { getCandidatesByJob } from "@/lib/api/candidates.api"

export default function JobDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(id)
  })

  const { data: stats } = useQuery({
    queryKey: ["job-stats", id],
    queryFn: () => getJobStats(id)
  })

  const { data: candidatesData } = useQuery({
    queryKey: ["candidates", id],
    queryFn: () => getCandidatesByJob(id),
    enabled: !!id,
  })

  const candidates = candidatesData?.data || []

  const deleteMutation = useMutation({
    mutationFn: () => deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      toast.success("Job deleted successfully")
      router.push("/dashboard/jobs")
    },
    onError: () => {
      toast.error("Failed to delete job")
    }
  })

  function handleDelete() {
    if (!confirm("Are you sure you want to delete this job?")) return
    deleteMutation.mutate()
  }

  // ✅ Skeleton
  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-6 w-60 bg-gray-200 rounded-md" />
        <div className="h-4 w-80 bg-gray-200 rounded-md" />
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="h-40 bg-gray-200 rounded-xl" />
      </div>
    )
  }

  if (isError || !job) return <p className="p-6">Job not found</p>

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 pb-2">

        {/* LEFT */}
        <div className="space-y-2 max-w-2xl">

            <h1 className="text-3xl font-semibold tracking-tight">
            {job.title}
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {job.description}
            </p>

            {/* subtle meta row */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                Active
            </span>
            <span>•</span>
            <span>{stats?.totalCandidates ?? 0} candidates</span>
            </div>

        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-2 sm:gap-3">

            <Link href={`/dashboard/jobs/${id}/candidates`}>
            <Button className="rounded-full px-4 bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md transition">
                View Candidates
            </Button>
            </Link>

            <Link href={`/dashboard/jobs/${id}/pipeline`}>
            <Button className="rounded-full px-4 bg-white/70 backdrop-blur border-0 shadow-sm hover:shadow-md transition">
                Pipeline
            </Button>
            </Link>

            <Link href={`/dashboard/jobs/${id}/edit`}>
            <Button variant="ghost" className="rounded-full text-muted-foreground hover:text-foreground transition">
                Edit
            </Button>
            </Link>

        </div>

        </div>

        {/* STATS */}
        {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {[
            { label: "Candidates", value: stats.totalCandidates },
            { label: "Parsed", value: stats.parsedResumes },
            { label: "Pending", value: stats.pendingResumes },
            { label: "Avg Score", value: stats.averageScore ?? "-" },
            { label: "Top Score", value: stats.topScore ?? "-" },
            ].map((item, i) => (
            <div
                key={i}
                className="rounded-2xl 
                bg-gradient-to-br from-white to-emerald-50/20 
                p-4 
                shadow-[0_6px_20px_rgba(0,0,0,0.04)] 
                hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] 
                hover:-translate-y-[2px] 
                transition-all duration-200"
            >
                <p className="text-xs text-gray-500 mb-1">
                {item.label}
                </p>
                <p className="text-2xl font-semibold tracking-tight">
                {item.value}
                </p>
            </div>
            ))}
        </div>
        )}

        {/* GRID LAYOUT (MAIN + SIDE) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">

            {/* SHARE */}
            <Card className="rounded-2xl bg-white/70 backdrop-blur-xl 
            shadow-[0_6px_20px_rgba(0,0,0,0.04)] 
            hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] 
            transition-all duration-200">
            <CardContent className="p-4 sm:p-5 space-y-4">
                <p className="text-sm font-medium">Share Job</p>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Button
                    variant="outline"
                    className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => {
                    navigator.clipboard.writeText(
                        `${window.location.origin}/jobs/${id}`
                    )
                    toast.success("Link copied")
                    }}
                >
                    Copy Link
                </Button>

                <Button
                    variant="ghost"
                    className="hover:text-foreground transition"
                    onClick={() => window.open(`/jobs/${id}`, "_blank")}
                >
                    Preview
                </Button>
                </div>
            </CardContent>
            </Card>

            {/* AI INSIGHTS */}
            <Card className="rounded-2xl 
            bg-gradient-to-br from-purple-50/60 to-white 
            shadow-[0_8px_30px_rgba(0,0,0,0.05)] 
            hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] 
            transition-all duration-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                🧠 AI Insights
                <span className="text-xs bg-purple-100/70 text-purple-700 px-2 py-0.5 rounded">
                    AI
                </span>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">

                {candidates.length > 0 ? (() => {
                const validScores = candidates
                    .map(c => c.hybridScore)
                    .filter(score => typeof score === "number")

                const avgScore = validScores.length
                    ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
                    : 0

                const topCandidate = candidates.reduce((prev, curr) => {
                    if (!curr.hybridScore) return prev
                    if (!prev) return curr
                    return curr.hybridScore > prev.hybridScore ? curr : prev
                }, null)

                const lowMatches = candidates.filter(
                    c => (c.hybridScore || 0) < 50
                ).length

                return (
                    <>
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-muted-foreground">Avg Match</p>
                        <p className="font-semibold text-lg">{avgScore}%</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-muted-foreground">Top Candidate</p>
                        <p className="font-medium">
                        {topCandidate?.name} ({topCandidate?.hybridScore}%)
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-muted-foreground">Low Matches</p>
                        <p>{lowMatches}</p>
                    </div>

                    <div className="bg-yellow-50/60 rounded-xl px-3 py-2 text-xs text-yellow-700">
                        Focus on high-match candidates to speed up hiring.
                    </div>
                    </>
                )
                })() : (
                <p className="text-muted-foreground">
                    No candidates yet
                </p>
                )}

            </CardContent>
            </Card>

        </div>

        {/* RIGHT SIDE (SUMMARY PANEL) */}
        <div className="space-y-6">

            <Card className="rounded-2xl 
            bg-white/70 backdrop-blur-xl 
            shadow-[0_6px_20px_rgba(0,0,0,0.04)]">

            <CardContent className="p-5 space-y-4">

                <p className="text-sm font-medium">
                Quick Info
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3 text-xs">

                {/* STATUS */}
                <div className="bg-zinc-50 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-muted-foreground">Status</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-600">
                    Active
                    </span>
                </div>

                {/* CANDIDATES */}
                <div className="bg-zinc-50 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-muted-foreground">Candidates</p>
                    <p className="font-medium mt-1">
                    {stats?.totalCandidates ?? 0}
                    </p>
                </div>

                {/* CREATED */}
                <div className="bg-zinc-50 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-muted-foreground">Created</p>
                    <p className="font-medium mt-1">
                    {job.createdAt
                        ? `${Math.floor((Date.now() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24))} days ago`
                        : "-"}
                    </p>
                </div>

                {/* UPDATED */}
                <div className="bg-zinc-50 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-muted-foreground">Last Updated</p>
                    <p className="font-medium mt-1">
                    {job.updatedAt
                        ? new Date(job.updatedAt).toLocaleDateString()
                        : "Not updated"}
                    </p>
                </div>

                {/* JOB ID */}
                <div className="bg-zinc-50 rounded-lg px-3 py-2 col-span-2">
                    <p className="text-[10px] text-muted-foreground">Job ID</p>
                    <p className="font-medium truncate mt-1">{id}</p>
                </div>

                </div>

            </CardContent>
            </Card>

        </div>

        </div>

        {/* DANGER ZONE */}
        <div className="pt-10">

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 items-start sm:items-center justify-between 
        bg-red-50/50 rounded-2xl px-4 py-3">

            <p className="text-xs text-red-600">
            Deleting this job is irreversible
            </p>

            <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="shadow-sm hover:shadow-md transition"
            >
            {deleteMutation.isPending ? "Deleting..." : "Delete Job"}
            </Button>

        </div>

        </div>

    </div>
  )

}

