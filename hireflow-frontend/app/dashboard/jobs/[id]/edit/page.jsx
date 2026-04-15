"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getJobById, updateJob } from "@/lib/api/jobs.api"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"



export default function EditJobPage() {

  const { id } = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")



  // Fetch job
  const { data: job, isLoading, error } = useQuery({
    queryKey: ["job", id],
    queryFn: () => getJobById(id)
  })



  // Fill form when job loads
  useEffect(() => {
    if (job) {
      setTitle(job.title)
      setDescription(job.description || "")
    }
  }, [job])



  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data) => updateJob(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job", id] })
      queryClient.invalidateQueries({ queryKey: ["jobs"] })

      toast.success("Job updated successfully")

      router.push(`/dashboard/jobs/${id}`)
    },

    onError: () => {
      toast.error("Failed to update job")
    }
  })



  function handleSubmit(e) {
    e.preventDefault()

    updateMutation.mutate({
      title,
      description
    })
  }



  if (isLoading) return <p>Loading...</p>
  if (error || !job) return <p>Job not found</p>



return (
  <div className="p-6 max-w-6xl mx-auto space-y-8 rounded-2xl bg-gradient-to-br from-white to-zinc-50/40 ">

    {/* HEADER */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      {/* LEFT */}
      <div className="space-y-1">

        <h1 className="text-3xl font-semibold tracking-tight">
          Edit Job
        </h1>

        <p className="text-sm text-muted-foreground">
          You're updating this job — changes will affect candidate matching
        </p>

      </div>

      {/* ACTION */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="rounded-full text-muted-foreground hover:text-foreground transition"
      >
        Cancel
      </Button>

    </div>

    {/* MAIN GRID */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

      {/* LEFT: FORM */}
      <div className="md:col-span-2">
        <Card className="rounded-2xl 
        bg-white/70 backdrop-blur-xl 
        shadow-[0_8px_30px_rgba(0,0,0,0.05)] 
        transition-all duration-200">
          <CardContent className="p-6 space-y-8">

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* JOB TITLE */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Job Title
                </label>

                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Backend Engineer"
                  className="h-11 rounded-xl bg-zinc-50 border-0 focus-visible:ring-2  focus-visible:ring-emerald-500/40 shadow-inner"
                />

                <p className="text-xs text-muted-foreground">
                  This will be visible to candidates
                </p>
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Description
                </label>

                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe responsibilities, requirements, and expectations..."
                  rows={5}
                  className="rounded-xl bg-zinc-50 border-0  focus-visible:ring-2 focus-visible:ring-emerald-500/40 shadow-inner"
                />

                <p className="text-xs text-muted-foreground">
                  Tip: Updating this improves AI matching accuracy
                </p>
              </div>

             
             {/* ACTIONS */}
              <div className="pt-6 flex items-center justify-end ">  
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="rounded-full px-6 font-medium 
                bg-emerald-600 text-white hover:bg-emerald-700 
                shadow-sm hover:shadow-md transition"
              >
                {updateMutation.isPending ? "Updating..." : "Save Changes"}
              </Button>

            </div>

            </form>

          </CardContent>
        </Card>
      </div>

      {/* RIGHT: SIDE PANEL */}
      <div className="space-y-4">

        {/* PREVIEW */}
        <Card className="rounded-2xl 
        bg-white/70 backdrop-blur-xl 
        shadow-[0_6px_20px_rgba(0,0,0,0.04)] 
        transition">
          <CardContent className="p-5 space-y-3">

            <p className="text-sm font-medium">
              Preview
            </p>

            <div className="rounded-xl p-4 bg-white shadow-sm">
              <p className="font-medium">
                {title || "Backend Engineer"}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-3 mt-1">
                {description || "Job description will appear here..."}
              </p>
            </div>

          </CardContent>
        </Card>

        {/* TIPS */}
        <Card className="rounded-2xl 
        bg-gradient-to-br from-yellow-50/60 to-white 
        shadow-[0_6px_20px_rgba(0,0,0,0.04)]">

          <CardContent className="p-5 space-y-4">

            {/* HEADER */}
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">💡</span>
              <p className="text-sm font-medium">
                Improve this job
              </p>
            </div>

            {/* LIST */}
            <ul className="space-y-3 text-xs">

              <li className="flex items-start gap-2 text-muted-foreground">
                <span className="text-yellow-500 mt-[2px]">✓</span>
                <span>Add clear responsibilities</span>
              </li>

              <li className="flex items-start gap-2 text-muted-foreground">
                <span className="text-yellow-500 mt-[2px]">✓</span>
                <span>Mention required tools & stack</span>
              </li>

              <li className="flex items-start gap-2 text-muted-foreground">
                <span className="text-yellow-500 mt-[2px]">✓</span>
                <span>Keep title specific (avoid generic)</span>
              </li>

              <li className="flex items-start gap-2 text-muted-foreground">
                <span className="text-yellow-500 mt-[2px]">✓</span>
                <span>Shorter descriptions perform better</span>
              </li>

            </ul>

            {/* FOOTER HINT */}
            <div className="text-[11px] text-yellow-700 bg-yellow-100/60 rounded-lg px-3 py-2">
              Better job descriptions improve AI matching accuracy
            </div>

          </CardContent>
        </Card>

        {/* STATUS INFO */}
        <Card className="rounded-2xl 
        bg-gradient-to-br from-purple-50/60 to-white 
        shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
          <CardContent className="p-5 space-y-2">

           <p className="text-xs text-muted-foreground">
            Changes here directly impact:
          </p>

          <ul className="text-xs space-y-2">
            <li className="flex items-center gap-2 text-muted-foreground">
              <span className="text-purple-500">●</span>
              Candidate matching score
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <span className="text-purple-500">●</span>
              AI resume insights
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <span className="text-purple-500">●</span>
              Public job page visibility
            </li>
          </ul>

          </CardContent>
        </Card>

      </div>

    </div>

  </div>
)  
}