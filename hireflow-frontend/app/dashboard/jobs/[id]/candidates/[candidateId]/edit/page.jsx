"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { fetcher } from "@/lib/fetcher"
import { getCandidateById } from "@/lib/api/candidates.api"

import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function EditCandidatePage() {
  const { id: jobId, candidateId } = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  // Fetch candidate
  const { data: candidate, isLoading, isError } = useQuery({
    queryKey: ["candidate", candidateId],
    queryFn: () => getCandidateById(candidateId)
  })

  // Fill form
  useEffect(() => {
    if (candidate) {
      setName(candidate.name || "")
      setEmail(candidate.email || "")
      setPhone(candidate.phone || "")
    }
  }, [candidate])

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async () =>
      fetcher(`/candidates/${candidateId}`, {
        method: "PATCH",
        body: JSON.stringify({ name, email, phone })
      }),

    onSuccess: () => {
      toast.success("Candidate updated")

      queryClient.invalidateQueries(["candidate", candidateId])
      queryClient.invalidateQueries(["candidates", jobId])

      router.push(`/dashboard/jobs/${jobId}/candidates/${candidateId}`)
    },

    onError: () => {
      toast.error("Failed to update candidate")
    }
  })

  // ✅ DIRTY STATE (ADD HERE)
  const isDirty =
    name !== (candidate?.name || "") ||
    email !== (candidate?.email || "") ||
    phone !== (candidate?.phone || "")

  function handleSubmit(e) {
    e.preventDefault()
    updateMutation.mutate()
  }

  if (isLoading) return <div className="p-6">Loading...</div>
  if (isError) return <div className="p-6 text-red-500">Failed to load candidate</div>

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6 bg-gradient-to-b from-zinc-50 to-white min-h-screen">

      {/* BACK */}
      <button
        onClick={() => router.back()}
        className="text-xs text-muted-foreground hover:text-foreground transition"
      >
        ← Back to Candidates
      </button>

      {/* HEADER */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">
          Jobs / Candidates / Edit
        </p>

        <h1 className="text-2xl font-semibold tracking-tight">
          Edit Candidate
        </h1>

        <p className="text-sm text-muted-foreground">
          Update candidate information
        </p>
      </div>

      {/* CARD */}
      <Card className="rounded-2xl border border-zinc-200/80 shadow-lg bg-white overflow-hidden">

        <CardHeader className="flex flex-row items-center gap-3 pb-3 border-b border-zinc-100">

          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-sm font-semibold text-gray-700 shadow-sm">
            {name ? name[0].toUpperCase() : "?"}
          </div>

          <div className="flex items-center gap-2">
            <div>
              <CardTitle className="text-base font-medium">
                Candidate Information
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Edit basic details
              </p>
            </div>

            <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full border border-yellow-200">
              Editing
            </span>
          </div>

        </CardHeader>

        <CardContent>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Name
              </label>

              <Input
                autoFocus
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className=" h-10 
                bg-white 
                border border-zinc-200 
                rounded-lg
                focus-visible:ring-2 focus-visible:ring-black/10
                focus-visible:border-zinc-400
                transition"
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Email
              </label>

              <Input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className=" h-10 
                bg-white 
                border border-zinc-200 
                rounded-lg
                focus-visible:ring-2 focus-visible:ring-black/10
                focus-visible:border-zinc-400
                transition"
              />
            </div>

            {/* PHONE */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Phone
              </label>

              <Input
                placeholder="Enter phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className=" h-10 
                bg-white 
                border border-zinc-200 
                rounded-lg
                focus-visible:ring-2 focus-visible:ring-black/10
                focus-visible:border-zinc-400
                transition"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex items-center justify-between pt-4 ">

              <button
                type="button"
                onClick={() => router.back()}
                className="text-sm text-zinc-500 hover:text-zinc-900 transition"
              >
                Cancel
              </button>

              <Button
                type="submit"
                disabled={updateMutation.isPending || !isDirty}
                className="min-w-[160px] 
                rounded-full 
                shadow-sm 
                bg-emerald-600 
                text-white 
                hover:bg-emerald-700 
                hover:shadow-md
                active:scale-[0.98]
                transition-all"
              >
                {updateMutation.isPending
                  ? "Updating..."
                  : "Save Changes"}
              </Button>

            </div>

          </form>

        </CardContent>

      </Card>

    </main>
  )
}