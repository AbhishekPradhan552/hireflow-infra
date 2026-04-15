"use client"

import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { getPublicJob } from "@/lib/api/public.api"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function PublicJobPage() {
  const { jobId } = useParams()
  const router = useRouter()

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ["public-job", jobId],
    queryFn: () => getPublicJob(jobId),
    enabled: !!jobId,
  })

  if (isLoading || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/40">
        <div className="mx-auto max-w-6xl px-4 pt-6 flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="mx-auto max-w-5xl px-4 py-12 grid gap-10 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-4 w-40" />
          </div>

          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!job.isOpen) {
    return (
      <div className="p-6 text-center space-y-3">
        <h2 className="text-xl font-semibold">Applications Closed</h2>
        <p className="text-sm text-muted-foreground">
          This job is no longer accepting applications.
        </p>
      </div>
    )
  }

  if (isError) {
    return <p className="p-6">Something went wrong</p>
  }

  return (
  <div className="
    min-h-screen 
    bg-gradient-to-br 
    from-emerald-50/60 via-white to-zinc-100
    animate-fadeIn
  ">

    {/* HEADER */}
    <div className="
      sticky top-0 z-50 
      backdrop-blur-xl 
      bg-white/60 
      border-b border-zinc-200/60
    ">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">

        <div className="flex items-center gap-2 font-semibold tracking-tight">
          <div className="
            w-8 h-8 rounded-xl 
            bg-zinc-900 text-white
            flex items-center justify-center 
            text-sm font-bold 
            shadow-sm
          ">
            H
          </div>
          <span className="text-zinc-900">HireFlow</span>
        </div>

        <div className="text-xs text-zinc-500">
          Powered by HireFlow
        </div>

      </div>
    </div>

    {/* MAIN */}
    <div className="mx-auto max-w-5xl px-4 py-12 grid gap-12 md:grid-cols-[2fr_1fr]">

     {/* LEFT → HERO */}
<div
  className="
    space-y-10
    rounded-2xl p-6 md:p-8

    bg-gradient-to-br 
    from-white/80 
    via-emerald-50/40 
    to-blue-50/40

    backdrop-blur-xl
    border border-white/40

    shadow-[0_0_0_1px_rgba(255,255,255,0.6),0_20px_60px_rgba(16,185,129,0.12)]
    hover:shadow-[0_30px_80px_rgba(16,185,129,0.18)]
    transition-all duration-300
  "
>

  {/* TITLE BLOCK */}
  <div className="space-y-4">

    <div className="
      inline-flex items-center gap-2 
      rounded-full 
      bg-emerald-100 text-emerald-700 
      px-3 py-1 text-xs font-medium w-fit
    ">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      Open Position
    </div>

    <h1 className="
      text-3xl md:text-4xl 
      font-semibold tracking-tight 
      leading-[1.15]

      bg-gradient-to-r 
      from-zinc-900 
      via-zinc-800 
      to-zinc-700 
      bg-clip-text text-transparent
    ">
      {job.title}
    </h1>

    <div className="
      flex items-center gap-2 text-sm text-zinc-600

      bg-white/40 backdrop-blur-sm 
      px-3 py-1.5 rounded-full w-fit

      border border-white/50
    ">
      <span>Remote</span>
      <span className="opacity-40">•</span>
      <span>Full-time</span>
    </div>

  </div>

  {/* ABOUT */}
  {job.description && (
    <div className="
      rounded-xl 
      bg-gradient-to-br from-emerald-100/70 to-transparent
      p-4 space-y-2

      shadow-[inset_0_1px_2px_rgba(16,185,129,0.08)]
    ">

      <h2 className="
        text-[11px] font-semibold tracking-wider 
        text-emerald-700 uppercase
      ">
        About the role
      </h2>

      <p className="
        text-sm leading-relaxed 
        text-zinc-700
      ">
        {job.description}
      </p>

    </div>
  )}

  {/* SKILLS */}
  {job.requiredSkills?.length > 0 && (
    <div className="
      rounded-xl 
      bg-gradient-to-br from-blue-50/60 to-transparent
      p-4 space-y-3

      shadow-[inset_0_1px_2px_rgba(59,130,246,0.08)]
    ">

      <h2 className="
        text-[11px] font-semibold tracking-wider 
        text-blue-700 uppercase
      ">
        Required Skills
      </h2>

      <div className="flex flex-wrap gap-2">
        {job.requiredSkills.map((skill) => (
          <span
            key={skill}
            className="
              text-xs font-medium
              px-3 py-1 rounded-full

              bg-white/80 text-zinc-700
              border border-blue-100

              hover:bg-blue-50
              transition
            "
          >
            {skill}
          </span>
        ))}
      </div>

    </div>
  )}

  {/* WHY JOIN */}
  <div className="
    rounded-xl 
    bg-gradient-to-br 
    from-purple-50/70 
    via-white 
    to-transparent

    p-5 space-y-3

    shadow-[0_10px_30px_rgba(168,85,247,0.08)]
  ">

    <div className="
      flex items-center gap-2 
      text-sm font-semibold text-purple-700
    ">
      ✨ Why join this role?
    </div>

    <p className="
      text-sm text-zinc-600 
      leading-relaxed
    ">
      Work on meaningful problems, collaborate with a focused team,
      and grow in a fast-paced environment.
    </p>

  </div>

</div>

    
      {/* RIGHT → ACTION CARD */}
      <div className="md:sticky md:top-20 h-fit">

        <Card
          className="
            rounded-2xl p-6 space-y-6

            bg-gradient-to-br from-white to-blue-50/40
            backdrop-blur-xl
            border border-blue-100/60

            shadow-[0_20px_60px_rgba(59,130,246,0.15)]

            transition-all duration-300 
            hover:shadow-[0_30px_80px_rgba(59,130,246,0.22)]
            hover:-translate-y-[2px]
          "
        >

          <CardHeader className="p-0 space-y-2 text-center">

            <h3 className="text-lg font-semibold tracking-tight text-zinc-900">
              Apply for this role
            </h3>

            <p className="text-xs text-zinc-500">
              Takes less than 2 minutes
            </p>

          </CardHeader>

          <CardContent className="p-0 space-y-5">

            <p className="text-[11px] text-zinc-500 text-center">
              🚀 120+ candidates applied
            </p>

            <Button
              className="
                w-full h-12 text-sm font-semibold
                bg-blue-600 text-white
                shadow-lg shadow-blue-500/20
                transition-all duration-200
                hover:bg-blue-700
                hover:scale-[1.03]
                active:scale-[0.97]
              "
              onClick={() => router.push(`/apply/${jobId}`)}
            >
              Apply Now
            </Button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-500">
              <span>⚡ Quick apply</span>
              <span>🔒 Secure</span>
              <span>⏱ 2 min</span>
            </div>

            <p className="text-[11px] text-zinc-500 text-center">
              No signup required
            </p>

          </CardContent>
        </Card>
      </div>

    </div>

    {/* FOOTER */}
    <div className="mt-20 pb-10 bg-gradient-to-t from-zinc-100/60 to-transparent">

      <div className="mx-auto max-w-5xl px-4 flex flex-col items-center gap-3 text-xs text-zinc-500">

        <p className="font-medium text-zinc-800">
          HireFlow
        </p>

        <p className="text-center max-w-sm">
          Simple, fast and AI-powered hiring workflows for modern teams.
        </p>

        <p className="text-[11px] opacity-70">
          © {new Date().getFullYear()} HireFlow
        </p>

      </div>
    </div>

  </div>
)
}