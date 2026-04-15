"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createCandidate } from "@/lib/api/candidates.api"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function CreateCandidatePage() {
  const { id: jobId } = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const createCandidateMutation = useMutation({
    mutationFn: () => createCandidate(jobId, { name, email, phone }),

    onSuccess: () => {
      toast.success("Candidate created")
      queryClient.invalidateQueries(["candidates", jobId])
      router.push(`/dashboard/jobs/${jobId}/candidates`)
    },

    onError: () => {
      toast.error("Failed to create candidate")
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    createCandidateMutation.mutate()
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">

      {/* HEADER */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">
          Jobs / Candidates / New
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Add Candidate
        </h1>
        <p className="text-sm text-muted-foreground">
          Quickly add a candidate to your pipeline
        </p>
      </div>

      {/* FORM CARD */}
      <Card className="border border-gray-200 rounded-2xl shadow-sm">

        <CardHeader className="flex flex-row items-center gap-3 pb-2">

          {/* Dynamic Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-sm font-semibold text-gray-700">
            {name ? name[0].toUpperCase() : "?"}
          </div>

          <div>
            <CardTitle className="text-base font-medium">
              Basic Information
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Enter candidate details
            </p>
          </div>

        </CardHeader>

        <CardContent>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">
                Name
              </label>

              <Input
                autoFocus
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-10 focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">
                Email
              </label>

              <Input
                type="email"
                placeholder="e.g. rahul@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>

            {/* PHONE */}
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">
                Phone
              </label>

              <Input
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>

            {/* INFO NOTE */}
            <div className="text-xs text-muted-foreground bg-muted/40 px-3 py-2 rounded-md">
              💡 You can upload resumes after creating the candidate
            </div>

            {/* ACTIONS */}
            <div className="flex items-center justify-between pt-4 border-t">

              <button
                type="button"
                onClick={() => router.back()}
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                Cancel
              </button>

              <Button
                type="submit"
                disabled={createCandidateMutation.isPending}
                className="min-w-[160px] rounded-full"
              >
                {createCandidateMutation.isPending
                  ? "Creating..."
                  : "Create Candidate"}
              </Button>

            </div>

          </form>

        </CardContent>
      </Card>

    </main>
  )
}