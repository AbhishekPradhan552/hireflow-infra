
"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useState } from "react"

import { getCandidatePipeline } from "@/lib/api/jobs.api"
import PipelineBoard from "@/components/pipeline/PipelineBoard"
import SearchInput from "@/components/ui/search-input"

export default function PipelinePage() {
  const { id: jobId } = useParams()
  const [search, setSearch] = useState("")

  const { data, isLoading, isError } = useQuery({
    queryKey: ["pipeline", jobId],
    queryFn: () => getCandidatePipeline(jobId),
    onError: () => toast.error("Failed to load pipeline"),
  })

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded-md" />
        <div className="h-10 w-72 bg-gray-200 rounded-md" />
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    )
  }

  if (isError) {
    return <div className="p-6 text-red-500">Failed to load pipeline</div>
  }

  const pipeline = data?.pipeline ?? {}

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        {/* LEFT */}
        <div className="space-y-1">
          <h1 className="text-[22px] font-semibold tracking-tight text-zinc-900">
            Candidate Pipeline
          </h1>
          <p className="text-xs text-zinc-500">
            Drag and move candidates across stages
          </p>
        </div>

        {/* RIGHT */}
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search candidates..."
          className="
            w-72 h-10
            rounded-full 
            bg-white 
            border border-zinc-200 
            shadow-sm
            focus:ring-2 focus:ring-black/5
          "
        />

      </div>

      {/* STATS BAR */}
      <div className="flex flex-wrap gap-2">

        {Object.entries(pipeline).map(([stage, list]) => {
          const count = list.length

          return (
            <div
              key={stage}
              className="
                flex items-center gap-2
                text-xs font-medium
                px-3 py-1.5 
                rounded-full
                bg-white 
                border border-zinc-200
                shadow-sm
              "
            >
              <span className="text-zinc-600 capitalize">
                {stage.toLowerCase()}
              </span>

              <span className="
                text-[11px] px-1.5 py-0.5 rounded-md 
                bg-zinc-100 text-zinc-600
              ">
                {count}
              </span>
            </div>
          )
        })}

      </div>

      {/* BOARD WRAPPER (important polish) */}
      <div className="
      rounded-2xl 
      p-4
      bg-gradient-to-br from-emerald-50/60 via-white to-emerald-50/60
      border border-emerald-100">
        <PipelineBoard
          pipeline={pipeline}
          jobId={jobId}
          search={search}
        />
      </div>

    </div>
  )
}

