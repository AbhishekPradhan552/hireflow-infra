"use client"

import { useState, useRef } from "react"
import { useParams } from "next/navigation"
import { useQuery, useMutation } from "@tanstack/react-query"



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  applyToJob,
  getPublicJob,
  getPresignedUrl,
  savePublicResume,
} from "@/lib/api/public.api";


export default function ApplyPage() {
  const params = useParams()

const jobId = Array.isArray(params.jobId)
  ? params.jobId[0]
  : params.jobId

console.log("🧪 jobId:", jobId, "type:", typeof jobId)

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ["public-job", jobId],
    queryFn: () => getPublicJob(jobId),
    enabled: !!jobId,
  })

  // ---------------- STATE ----------------
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [file, setFile] = useState(null)
  const [errorMsg, setErrorMsg] = useState("")
  const [success, setSuccess] = useState(false)
  const [progress, setProgress] = useState(0)

  const fileRef = useRef(null)

  
  // ---------------- MUTATION ----------------
const mutation = useMutation({
  mutationFn: async () => {
    setProgress(10);

    const interval = setInterval(() => {
      setProgress((p) => (p < 90 ? p + 8 : p));
    }, 200);

    try {
      // 1. create candidate
      const candidate = await applyToJob(jobId, {
        name,
        email,
        phone,
      });

      console.log("✅ candidate created:", candidate);

      // 2. get presigned URL
      const { uploadUrl, key } = await getPresignedUrl({
        fileName: file.name,
        fileType: file.type,
        jobId,
      });

      // 3. upload to S3 directly
      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      // 4. save resume in DB
      await savePublicResume({
        candidateId: candidate.candidateId, // IMPORTANT FIX
        orgId: candidate.orgId,
        key,
        originalName: file.name,
        mimeType: file.type,
        fileSize: file.size,
      });

      setProgress(100);

      await new Promise((r) => setTimeout(r, 300));

      return candidate;
    } catch (err) {
      console.error("❌ mutation failed:", err);
      throw err;
    } finally {
      clearInterval(interval);
    }
  },
 

  onSuccess: () => {
    console.log("🎉 success triggered")

    setSuccess(true)
    setProgress(0)
    setErrorMsg("")
  },

  onError: (err) => {
    setProgress(0)

    const message =
      err?.error || err?.message || err?.response?.data?.error || ""

    console.error("❌ APPLY ERROR:", message, err)

    if (message.toLowerCase().includes("already applied")) {
      setErrorMsg("You have already applied for this job.")
    } else if (message.toLowerCase().includes("not accepting")) {
      setErrorMsg("This job is no longer accepting applications.")
    } else if (message.toLowerCase().includes("resume")) {
      setErrorMsg("Resume upload failed. Please try again.")
    } else {
      setErrorMsg("Something went wrong. Please try again.")
    }
  },
})

// ---------------- SUBMIT ----------------
function handleSubmit(e) {
  e.preventDefault()
  console.log("🔥 SUBMIT TRIGGERED")
  setErrorMsg("")

  if (!file) {
    setErrorMsg("Please upload your resume")
    return
  }

  console.log("📦 file being sent:", file)

  
  mutation.mutate()
}

  // ---------------- STATES ----------------

// ✅ SUCCESS FIRST (important)
if (success) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">

      <div className="text-center space-y-6 animate-fadeIn">

        <div className="flex items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-scaleIn">

            <svg
              className="h-10 w-10 text-green-600 animate-draw"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>

          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">
            Application submitted
          </h1>

          <p className="text-sm text-muted-foreground">
            We’ve received your application.  
            You’ll hear back soon.
          </p>
        </div>

        <Button
          onClick={() => window.location.reload()}
          className="mt-4 px-5 py-2 rounded-lg bg-primary text-white text-sm hover:opacity-90 active:scale-[0.98] transition"
        >
          Apply again
        </Button>

      </div>

    </div>
  )
}

// ✅ LOADING
if (isLoading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-emerald-50/40 to-background">

      {/* HEADER */}
      <div className="h-16 flex items-center justify-between px-6 max-w-6xl mx-auto">
        <Skeleton className="h-6 w-24 rounded-md" />
        <Skeleton className="h-4 w-32 rounded-md" />
      </div>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">

        {/* LEFT */}
        <div className="space-y-6">

          <div className="space-y-3">
            <Skeleton className="h-10 w-3/4 rounded-lg" />
            <Skeleton className="h-5 w-1/3 rounded-full" />
          </div>

          <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-xl space-y-4">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />

            <div className="flex gap-2 pt-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-36" />
          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl space-y-5">

            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>

            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />

            <Skeleton className="h-24 w-full rounded-xl" />

            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

        </div>

      </div>
    </div>
  )
}

// ✅ ERROR
if (isError || !job) {
  return (
    <div className="h-screen flex items-center justify-center text-red-500">
      Failed to load job
    </div>
  )
}



  // ---------------- UI ----------------

 return (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_40%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.10),transparent_40%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.08),transparent_50%)] bg-background">

    {/* ================= HEADER ================= */}
    <div className="sticky top-0 z-20 backdrop-blur-xl bg-background/60">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-primary/90" />
          <span className="font-semibold tracking-tight">HireFlow</span>
        </div>

        <span className="text-xs text-muted-foreground">
          Smart hiring platform
        </span>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
    </div>

    {/* ================= MAIN ================= */}
    <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">

      {/* LEFT */}
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            {job.title}
          </h1>

          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
              ● Open Position
            </span>

            <span className="text-xs text-muted-foreground">
              Hiring via HireFlow
            </span>
          </div>
        </div>

        {/* GLASS CARD */}
        <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-emerald-300/40 via-indigo-300/30 to-purple-300/20">

          <Card className="border-0 rounded-2xl bg-background/70 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
            <CardContent className="p-6 space-y-6">

              <div>
                <h2 className="font-semibold mb-2 text-lg">About this role</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {job.description || "No description provided"}
                </p>
              </div>

              {job.requiredSkills?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Skills required</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 font-medium hover:bg-emerald-500/20 transition"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>✔ Your data is secure</p>
          <p>✔ Resume parsed instantly</p>
          <p>✔ No spam applications</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="relative">

        {/* SOFT GLOW (important for focus) */}
        <div className="absolute -inset-6 bg-gradient-to-r from-emerald-400/20 via-indigo-400/10 to-purple-400/10 blur-3xl opacity-70 pointer-events-none" />

        <Card className="relative border-0 rounded-2xl bg-background/80 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_35px_100px_rgba(0,0,0,0.18)]">

          <CardHeader>
            <CardTitle className="text-xl">Apply Now</CardTitle>
            <p className="text-sm text-muted-foreground">
              Takes less than 2 minutes
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              {errorMsg && (
                <div className="text-sm text-red-500">{errorMsg}</div>
              )}

              {/* INPUTS */}
              <div className="space-y-4">

                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 rounded-xl px-4 text-[15px] font-medium text-foreground caret-primary
                  bg-background/60 backdrop-blur-md
                  border border-transparent shadow-sm
                  placeholder:text-muted-foreground/60
                  focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                />

                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-xl px-4 text-[15px] font-medium text-foreground caret-primary
                  bg-background/60 backdrop-blur-md
                  border border-transparent shadow-sm
                  placeholder:text-muted-foreground/60
                  focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                />

                <Input
                  type="text"
                  placeholder="Phone (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 rounded-xl px-4 text-[15px] font-medium text-foreground caret-primary
                  bg-background/60 backdrop-blur-md
                  border border-transparent shadow-sm
                  placeholder:text-muted-foreground/60
                  focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                />

              </div>

              {/* UPLOAD */}
              <div className="space-y-2">

                <div
                  onClick={() => !file && fileRef.current?.click()}
                  className={`group relative rounded-xl p-6 cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] hover:shadow-md
                  ${file
                    ? "bg-emerald-50/80 dark:bg-emerald-900/30"
                    : "border border-dashed border-border/40 hover:border-emerald-400 hover:bg-emerald-400/5"
                  }`}
                >

                  {!file ? (
                    <div className="space-y-1 text-center">
                      <p className="font-medium group-hover:text-emerald-600 transition-colors">
                        Upload your resume
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF, DOC, DOCX (max 5MB)
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-emerald-600 font-medium">
                        Ready to upload
                      </span>
                    </div>
                  )}
                </div>

                <Input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const selectedFile = e.target.files[0]
                    if (!selectedFile) return

                    const allowedTypes = [
                      "application/pdf",
                      "application/msword",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    ]

                    if (!allowedTypes.includes(selectedFile.type)) {
                      setErrorMsg("Only PDF, DOC, DOCX allowed")
                      return
                    }

                    if (selectedFile.size > 5 * 1024 * 1024) {
                      setErrorMsg("File must be under 5MB")
                      return
                    }

                    setFile(selectedFile)
                    setErrorMsg("")
                  }}
                />
              </div>

              {/* PROGRESS */}
              {mutation.isPending && (
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {/* BUTTON */}
              <Button
                type="submit"
                disabled={mutation.isPending || !name || !email || !file}
                className="w-full h-12 rounded-xl text-sm font-medium 
                bg-gradient-to-r from-emerald-500 to-emerald-600 
                text-white shadow-md 
                hover:opacity-95 active:scale-[0.98] transition-all"
              >
                {mutation.isPending ? "Submitting..." : "Apply Now"}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>

    {/* FOOTER */}
    <div className="mt-20 pb-10 text-center text-xs text-muted-foreground">
      <div className="max-w-6xl mx-auto px-6 space-y-3">
        <div className="h-px bg-gradient-to-r from-transparent via-border/30 to-transparent mb-4" />
        <p>© {new Date().getFullYear()} HireFlow</p>
        <p className="text-[11px] opacity-70">
          Built for modern hiring teams
        </p>
      </div>
    </div>

  </div>
 )
}