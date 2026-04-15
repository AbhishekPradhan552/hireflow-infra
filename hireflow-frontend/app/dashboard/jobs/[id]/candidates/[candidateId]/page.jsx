"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"

import {
  getCandidateById,
  deleteCandidate,
  updateCandidateStatus
} from "@/lib/api/candidates.api"

import { fetcher } from "@/lib/fetcher"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import ScoreBadge from "@/components/ScoreBadge"
import { toast } from "sonner"
import { uploadResume } from "@/lib/uploadResume";

export default function CandidateDetailPage() {

  const { id, candidateId } = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [selectedResumeId, setSelectedResumeId] = useState(null)

  /* ---------------- FETCH CANDIDATE ---------------- */

  const { data: candidate, isLoading } = useQuery({
    queryKey: ["candidate", candidateId],
    queryFn: () => getCandidateById(candidateId),

    refetchInterval: (query) => {
      const resumes = query.state.data?.resumes

      const pending = resumes?.some(
        (r) =>
          r.parseStatus === "PENDING" ||
          r.parseStatus === "PROCESSING" ||
          r.aiStatus === "PENDING" ||
          r.aiStatus === "EMBEDDING" ||
          r.aiStatus === "SCORING"
          
      )
      // ✅ Don't poll in background tabs
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
         return false
      }

      return pending ? 10000 : false
    }
  })

  /* ---------------- UPDATE STATUS ---------------- */

  const statusMutation = useMutation({
    mutationFn: (status) => updateCandidateStatus(candidateId, status),

    onSuccess: (_, status) => {
      queryClient.invalidateQueries({ queryKey: ["candidate", candidateId] })
      queryClient.invalidateQueries({ queryKey: ["pipeline", id] })

      toast.success(`Candidate moved to ${status}`)
    },

    onError: () => {
      toast.error("Failed to update candidate stage")
    }
  })

  /* ---------------- UPLOAD RESUME ---------------- */

  const uploadMutation = useMutation({
    mutationFn: async () => {
        return await uploadResume({
            file,
            candidateId,
        });      
    },

    onSuccess: (resume) => {

      queryClient.invalidateQueries({ queryKey: ["candidate", candidateId] })
      queryClient.invalidateQueries({ queryKey: ["candidates"] })
      queryClient.invalidateQueries({ queryKey: ["pipeline", id] })

      setSelectedResumeId(resume?.id ?? null)
      setFile(null)

      toast.success("Resume uploaded successfully")
    },

    onError: (err) => {
      console.error("Upload failed:", err)
      toast.error("Failed to upload resume")
    }
  })

  /* ---------------- DELETE CANDIDATE ---------------- */

  const deleteMutation = useMutation({
    mutationFn: () => deleteCandidate(candidateId),

    onSuccess: () => {
      toast.success("Candidate deleted")
      router.push(`/dashboard/jobs/${id}/candidates`)
    },

    onError: () => {
      toast.error("Failed to delete candidate")
    }
  })

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  if (!candidate) {
    return <div className="p-6">Candidate not found</div>
  }

  /* ---------------- RESUME SELECTION ---------------- */

  const resumeToShow =
    candidate.resumes?.find((r) => r.id === selectedResumeId) ||
    candidate.resumes?.find((r) => r.id === candidate.bestResumeId) ||
    candidate.resumes?.[0] ||
    null

  const isBestResume = resumeToShow?.id === candidate.bestResumeId

  /*------file upload validation check-- */
  function isValidFile(file){
    if(!file) return false

    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    return allowedTypes.includes(file.type)
  }

  


  return (
    <div className="px-3 sm:px-6 py-4 sm:py-6 max-w-5xl space-y-6 bg-gradient-to-b from-emerald-50 via-emerald-50/30 to-white min-h-screen">

        
        {/* HEADER */}
        <div className="
        flex flex-col sm:flex-row
        gap-4 sm:gap-0
        sm:justify-between sm:items-center
        px-1 py-2
        ">

        {/* LEFT */}
        <div className="flex items-center gap-3">

            <Button
                onClick={() => router.push(`/dashboard/jobs/${id}/candidates`)}
                className="
                flex items-center gap-1
                text-xs font-medium text-zinc-500
                hover:text-zinc-900
                transition
                px-2 py-1 rounded-md
                hover:bg-zinc-100
                "
            >
                <ArrowLeft size={14} />
                Back
            </Button>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-zinc-200 text-zinc-700 font-semibold flex items-center justify-center text-sm">
            {candidate.name?.charAt(0)}
            </div>

            <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-zinc-900 leading-tight">
                {candidate.name}
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
                Candidate Details
            </p>
            </div>

        </div>

        {/* RIGHT */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">

            {/* STATUS */}
            <Select
            value={candidate.status}
            onValueChange={(value) => statusMutation.mutate(value)}
            >
            <SelectTrigger
                className="
                w-full sm:w-[170px] h-9 
                rounded-full 
                bg-white 
                border border-zinc-200 
                shadow-sm
                hover:bg-zinc-50 
                transition
                "
            >
                <SelectValue />
            </SelectTrigger>

            <SelectContent className="rounded-xl border border-zinc-200 shadow-md">
                <SelectItem value="APPLIED">Applied</SelectItem>
                <SelectItem value="SCREENING">Screening</SelectItem>
                <SelectItem value="INTERVIEW">Interview</SelectItem>
                <SelectItem value="OFFER">Offer</SelectItem>
                <SelectItem value="HIRED">Hired</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
            </Select>

            {/* SCORE */}
            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-zinc-100">
            <ScoreBadge score={candidate.bestScore} />
            <span className="text-[11px] text-zinc-500 font-medium">Match</span>
            </div>

        </div>

        </div>


        {/* CONTACT INFO */}
        <Card className="rounded-2xl border border-zinc-200 shadow-md bg-white hover:shadow-lg transition">
            <CardContent className="p-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">

                {/* EMAIL */}
                <div className="space-y-1">
                    <p className="text-xs text-zinc-500 font-medium">Email</p>
                    <p className="text-sm font-semibold text-zinc-900 break-all">
                    {candidate.email}
                    </p>
                </div>

                {/* PHONE */}
                <div className="space-y-1">
                    <p className="text-xs text-zinc-500 font-medium">Phone</p>
                    <p className="text-sm font-semibold text-zinc-900">
                    {candidate.phone || "Not provided"}
                    </p>
                </div>

                </div>

            </CardContent>
        </Card>


        
        {/* AI INSIGHTS (🔥 MOST IMPORTANT) */}
        {resumeToShow && (
            <Card className="
            rounded-2xl 
            border border-purple-200 
            shadow-[0_12px_40px_rgba(124,58,237,0.12)] 
            bg-gradient-to-br from-purple-50 via-white to-purple-50
            transition
            ">

            {/* HEADER */}
            <CardHeader className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between pb-4">
                <div className="flex items-center gap-2">

                <CardTitle className="flex items-center gap-2 text-base font-semibold text-zinc-900">
                    🧠 AI Insights
                </CardTitle>

                <span className="text-[11px] font-medium bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                    AI Powered
                </span>

                {isBestResume && (
                    <span className="text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                    ⭐ Best Resume
                    </span>
                )}
                </div>

                {resumeToShow.hybridScore && (
                <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-md border border-zinc-200 shadow-sm">
                    <ScoreBadge score={resumeToShow.hybridScore} />
                    <span className="text-[11px] text-zinc-500 font-medium">Match</span>
                </div>
                )}

            </CardHeader>

            <CardContent className="space-y-6">

                {/* LOADING */}
                {["PENDING", "EMBEDDING", "SCORING"].includes(resumeToShow.aiStatus) && (
                <p className="text-sm text-purple-600 animate-pulse font-medium">
                    🤖 AI is analyzing this resume...
                </p>
                )}

                {/* SUMMARY */}
                {resumeToShow.aiSummary && (
                <div className="bg-white border border-purple-100 rounded-xl p-5 shadow-sm">
                    
                    <p className="text-[11px] uppercase tracking-wide text-zinc-500 mb-2 font-semibold">
                    AI Summary
                    </p>

                    <p className="text-sm leading-relaxed text-zinc-700">
                    {resumeToShow.aiSummary}
                    </p>

                </div>
                )}

                {/* SKILLS */}
                <div className="space-y-5">

                {resumeToShow.matchedSkills?.length > 0 && (
                    <div>
                    <p className="text-[11px] uppercase tracking-wide text-zinc-500 mb-2 font-semibold">
                        Matched Skills
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {resumeToShow.matchedSkills.map((s, i) => (
                        <span
                            key={i}
                            className="
                            text-xs 
                            font-medium
                            bg-emerald-50 
                            text-emerald-700 
                            border border-emerald-200 
                            px-3 py-1 
                            rounded-full
                            shadow-[0_1px_0_rgba(0,0,0,0.03)]
                            "
                        >
                            {s}
                        </span>
                        ))}
                    </div>
                    </div>
                )}

                {resumeToShow.missingSkills?.length > 0 && (
                    <div>
                    <p className="text-[11px] uppercase tracking-wide text-zinc-500 mb-2 font-semibold">
                        Missing Skills
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {resumeToShow.missingSkills.map((s, i) => (
                        <span
                            key={i}
                            className="
                            text-xs 
                            font-medium
                            bg-red-50 
                            text-red-600 
                            border border-red-200 
                            px-3 py-1 
                            rounded-full
                            "
                        >
                            {s}
                        </span>
                        ))}
                    </div>
                    </div>
                )}

                </div>

                {/* AI TIP */}
                <div className="bg-purple-50/60 border border-purple-100 rounded-lg px-3 py-2">
                <p className="text-[11px] text-purple-700 font-medium">
                    💡 AI suggests focusing on high-match candidates for faster shortlisting.
                </p>
                </div>

            </CardContent>
            </Card>
        )}



        
        {/* RESUME LIST */}
<Card className="rounded-2xl border border-zinc-200 shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white/80 backdrop-blur-xl">
  <CardContent className="p-5 space-y-4">

    {/* HEADER */}
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-zinc-900">Resumes</p>
      <span className="text-xs text-zinc-500">
        {candidate.resumes.length} total
      </span>
    </div>

    {/* EMPTY STATE */}
    {candidate.resumes.length === 0 ? (
      <div className="
        relative
        flex flex-col items-center justify-center
        text-center
        py-14 px-6
        rounded-xl
        border border-dashed border-zinc-300
        bg-gradient-to-br from-white via-zinc-50/50 to-white
        overflow-hidden
      ">

        {/* subtle glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-transparent to-emerald-100/20 blur-2xl opacity-60" />

        {/* ICON */}
        <div className="
          relative z-10
          text-3xl mb-3
          animate-bounce
        ">
          📄
        </div>

        {/* TITLE */}
        <p className="relative z-10 text-sm font-semibold text-zinc-900">
          No resumes uploaded yet
        </p>

        {/* SUBTEXT */}
        <p className="relative z-10 text-xs text-zinc-500 mt-1 max-w-[260px]">
          Upload a resume to unlock AI insights, skill matching, and candidate scoring
        </p>

        {/* CTA HINT */}
        <div className="
          relative z-10 mt-4
          text-[11px] text-blue-600 font-medium
        ">
          ↓ Upload below to get started
        </div>

      </div>
    ) : (

      /* EXISTING LIST (UNCHANGED) */
      <div className="divide-y divide-zinc-100 -mx-2">
        {candidate.resumes.map((resume) => {
          const isActive = resume.id === resumeToShow?.id
          const isBest = resume.id === candidate.bestResumeId

          return (
            <div
              key={resume.id}
              onClick={() => setSelectedResumeId(resume.id)}
              className={`
                flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center px-4 py-3
                cursor-pointer transition-all duration-200
                hover:translate-y-[-1px]

                ${
                  isActive
                    ? "bg-blue-50/80 border border-blue-200 rounded-lg relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-blue-500 before:rounded-full"
                    : "hover:bg-zinc-50 rounded-lg"
                }
              `}
            >

              <div className="flex items-start sm:items-center gap-3 min-w-0">

                <span className="text-zinc-400 text-lg">📄</span>

                <div className="flex items-center gap-3 text-sm flex-wrap">

                  <a
                    href={resume.downloadUrl}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1"
                  >
                    Download
                  </a>

                  <span className="text-xs text-zinc-500">
                    {resume.parseStatus}
                  </span>

                  {resume.hybridScore && (
                    <div className="flex items-center">
                      <ScoreBadge score={resume.hybridScore} />
                    </div>
                  )}

                  {isBest && (
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 shadow-[0_0_0_1px_rgba(16,185,129,0.1)]">
                      ⭐ Best
                    </span>
                  )}

                </div>
              </div>

              {isActive && (
                <span className="text-xs text-blue-600 font-medium opacity-80">
                  Selected
                </span>
              )}

            </div>
          )
        })}
      </div>
    )}

  </CardContent>
</Card>
        

        
        
        {/* UPLOAD */}
        <Card
        onDrop={(e) => {
            e.preventDefault()
            setDragActive(false)

            const droppedFile = e.dataTransfer.files[0]
            if (!droppedFile) return

            if (!isValidFile(droppedFile)) {
            toast.error("Invalid file type")
            return
            }

            setFile(droppedFile)
        }}
        onDragOver={(e) => {
            e.preventDefault()
            setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        className={`
            rounded-2xl border border-dashed transition-all duration-200
            bg-white shadow-md

            ${
            dragActive
                ? "border-blue-400 bg-blue-50/60 shadow-lg"
                : "border-zinc-300 hover:border-zinc-400 hover:shadow-lg"
            }
        `}
        >
        <CardContent className="p-8 text-center space-y-5">

            {/* ICON */}
            <div className="text-3xl transition">
            {dragActive ? "📂" : "📤"}
            </div>

            {/* TEXT */}
            <div className="space-y-1">
            <p className="text-sm font-semibold text-zinc-900">
                {dragActive ? "Drop your resume here" : "Upload new resume"}
            </p>
            <p className="text-xs text-zinc-500">
                Drag & drop or select file (PDF, DOC, DOCX)
            </p>
            </div>

            {/* INPUT */}
            <input
            id="resume-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => {
                const selected = e.target.files[0]

                if (!selected) return

                if (!isValidFile(selected)) {
                toast.error("Invalid file type")
                return
                }

                setFile(selected)
            }}
            />

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">

            <Button
                variant="outline"
                className="rounded-full border-zinc-300 hover:bg-zinc-50"
                asChild
            >
                <label htmlFor="resume-upload" className="cursor-pointer">
                Select File
                </label>
            </Button>

            <Button
                onClick={() => uploadMutation.mutate()}
                disabled={!file}
                className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
            >
                Upload
            </Button>

            </div>

            {/* FILE NAME */}
            {file && (
            <p className="text-xs text-emerald-600">
                ✓ {file.name}
            </p>
            )}

        </CardContent>
        </Card>


        
        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 items-center justify-between pt-6">

        <Button
            variant="outline"
            onClick={() =>
            router.push(`/dashboard/jobs/${id}/candidates/${candidateId}/edit`)
            }
            className="rounded-full border-zinc-300 hover:bg-zinc-50"
        >
            Edit Candidate
        </Button>

        <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate()}
            className="rounded-full"
        >
            Delete Candidate
        </Button>

        </div>



    </div>
  )


}