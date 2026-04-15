"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { can } from "@/lib/can";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  getJobs,
  deleteJob,
  updateJobStatus,
} from "@/lib/api/jobs.api";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatJobDate } from "@/lib/utils/date";
import SearchInput from "@/components/ui/search-input"
import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";

import { Briefcase } from "lucide-react";

export default function JobsPage() {
  const router = useRouter();

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null

  const queryClient = useQueryClient();

  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("")

  const { data, isLoading, isFetching,error } = useQuery({
    queryKey: ["jobs", status, page, search],
    queryFn: () => getJobs({ status, page, search }),
    keepPreviousData: true,
  });

  const jobs = data?.data || [];
  const meta = data?.meta;

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job deleted");
    },
    onError: () => toast.error("Failed to delete job"),
  });

  // TOGGLE STATUS
  const toggleMutation = useMutation({
    mutationFn: ({ id, status }) => updateJobStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  function handleDelete(jobId) {
    
    deleteMutation.mutate(jobId);
  }

  function handleToggle(job) {
    const newStatus = job.status === "OPEN" ? "CLOSED" : "OPEN";
    toggleMutation.mutate({ id: job.id, status: newStatus });
  }

  // LOADING
  if (isLoading) {
  return (
    <main className="p-6 space-y-8 max-w-6xl mx-auto">
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl bg-zinc-200/80" />
        ))}
      </div>
    </main>
  );
}
  if (error) {
    return <p className="p-6 text-red-500">{error.message}</p>;
  }

  return (
    <main className="w-full px-3 sm:px-6 py-4 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="
        flex flex-col sm:flex-row
        gap-3 sm:gap-4
        sm:items-center sm:justify-between
        bg-white/60 backdrop-blur-xl 
        border border-zinc-200/50 
        rounded-2xl px-3 sm:px-4 py-3 
        shadow-[0_8px_25px_rgba(0,0,0,0.04)]
      ">

        <div>
          <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-500 bg-clip-text text-transparent">Jobs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track all your job postings
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto sm:items-center">
            {/*SEARCH */}
            <SearchInput
                value={search}
                onChange= {(val)=>{
                    setSearch(val)
                    setPage(1)
                }}
                debounce={400}
                placeholder ="Search jobs..."
                className= "w-full sm:w-[240px] h-10 text-sm bg-white/70 border border-zinc-200/60 backdrop-blur-sm rounded-full"
            />    

          {/* FILTER */}
          <Select
            value={status}
            onValueChange={(val) => {
              setStatus(val);
              setPage(1);
            }}
          >
            <SelectTrigger
              className="
                w-full sm:w-[150px] h-10
                rounded-full 
                bg-white/70 backdrop-blur-md
                border border-zinc-200/60
                hover:bg-white
                focus:ring-2 focus:ring-emerald-500/20
                shadow-[0_4px_14px_rgba(0,0,0,0.06)]
                hover:shadow-[0_6px_18px_rgba(0,0,0,0.08)]
                transition-all
                flex items-center justify-between px-3
              "
            >
              {/* ✅ THIS is the key fix */}
              <SelectValue asChild>
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-800">
                  {status === "OPEN" && (
                    <>
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Active
                    </>
                  )}

                  {status === "CLOSED" && (
                    <>
                      <span className="h-2 w-2 rounded-full bg-zinc-400" />
                      Closed
                    </>
                  )}

                  {status === "all" && "All jobs"}
                </div>
              </SelectValue>

              
            </SelectTrigger>

            <SelectContent
              align="end"
              className="
                w-[160px]
                rounded-xl 
                border border-zinc-200/60
                bg-white
                shadow-[0_10px_30px_rgba(0,0,0,0.08)]
                p-1
                z-50
              "
            >
              <SelectItem value="all" className="rounded-lg px-3 py-2 text-sm">
                All jobs
              </SelectItem>

              <SelectItem value="OPEN" className="rounded-lg px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Active
                </div>
              </SelectItem>

              <SelectItem value="CLOSED" className="rounded-lg px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-zinc-400" />
                  Closed
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {can(user,"job:create") && (

            <Link href="/dashboard/jobs/new">
              <Button className="w-full sm:w-auto rounded-full px-4 sm:px-5 text-sm  
              bg-emerald-50/60 backdrop-blur 
              text-emerald-700 
              border border-emerald-200/60 
              hover:bg-emerald-100/70 
              shadow-[0_6px_20px_rgba(16,185,129,0.08)] 
              hover:shadow-[0_10px_25px_rgba(16,185,129,0.12)] 
              transition-all">
                + Create Job
              </Button>
            </Link>

          )}
          
        </div>
      </div>

      {/* EMPTY STATE */}
      {jobs.length === 0 && (
        <Empty className="py-20">
            
            <EmptyHeader>
            <Briefcase className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />

            <EmptyTitle>
                {search ? "No matching jobs found" : "No jobs found"}
            </EmptyTitle>

            <EmptyDescription>
                {search
                ? `No results for "${search}"`
                : "Create your first job to get started"}
            </EmptyDescription>
            </EmptyHeader>

            {!search && can(user, "job:create") && (
              <EmptyContent>
                <Link href="/dashboard/jobs/new">
                  <Button className="rounded-full px-5">
                    + Create Job
                  </Button>
                </Link>
              </EmptyContent>
            )}

        </Empty>
      )}

      {jobs.length > 0 && jobs.length <= 2 && (
        <p className="text-xs text-muted-foreground/80 mb-2 pl-1">
            Tip: Add more roles to compare applicants effectively
        </p>
     )}
        
      {/* TABLE */}
      {jobs.length > 0 && (
        <Card className="rounded-3xl 
          bg-gradient-to-br from-white/80 to-zinc-50/60 
          backdrop-blur-xl 
          border border-zinc-200/60 
          shadow-[0_12px_35px_rgba(0,0,0,0.06)]">

          <CardContent className="p-3 sm:p-4 space-y-3">

            {/* HEADER (FIXED ALIGNMENT) */}
            <div className="
              hidden md:grid grid-cols-[2fr_1fr_1fr]
              px-6 pb-2
              text-xs uppercase tracking-wide text-muted-foreground
            ">
              <div>Role</div>
              <div>Candidates</div>
              <div className="text-right">Actions</div>
            </div>

            {/* DESKTOP TABLE */}
            <div className="block">
              {/* existing Card + table stays SAME */}
              <div className="space-y-3">

              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
                  className={`
                    group relative cursor-pointer
                    rounded-2xl border border-zinc-200/60
                    bg-white/70 backdrop-blur-xl

                    transition-all duration-200 ease-out

                    shadow-[0_4px_14px_rgba(0,0,0,0.04)]
                    sm:hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]
                    sm:hover:-translate-y-[2px]
                    sm:hover:scale-[1.01]
                    hover:border-zinc-300

                    active:scale-[0.98]
                    active:shadow-md


                    ${job.status === "CLOSED" ? "opacity-60" : ""}
                  `}
                >

                  {/* LEFT ACCENT (🔥 premium touch) */}
                  <div className={`
                    absolute left-0 top-0 h-full w-[3px] rounded-l-2xl
                    ${job.status === "OPEN" ? "bg-emerald-500" : "bg-zinc-300"}
                  `} />

                  {/* GRID */}
                  <div className="
                    grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr]
                    gap-3 md:gap-0
                    items-start md:items-center
                    px-4 md:px-6 py-4 md:py-5
                  ">

                    {/* ROLE */}
                    <div className="space-y-1.5 pr-4">
                      <p className="font-medium text-sm leading-tight">
                        {job.title}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span>Created {formatJobDate(job.createdAt)}</span>
                        <span className="opacity-50">•</span>

                        <span
                          className={`font-medium px-1.5 py-0.5 rounded
                            ${
                              job.status === "OPEN"
                                ? "text-emerald-700 bg-emerald-50"
                                : "text-zinc-500 bg-zinc-100"
                            }
                          `}
                        >
                          {job.status === "OPEN" ? "Active" : "Closed"}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground/80 line-clamp-1">
                        {job.description || "No description"}
                      </p>
                    </div>

                    {/* CANDIDATES */}
                    <div className="flex items-center gap-1 text-sm">
                      <span className="font-medium">
                        {job.candidateCount}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        applicant{job.candidateCount !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* ACTIONS */}
                    <div
                      className="
                        flex justify-start md:justify-end gap-4 text-sm
                        opacity-100 sm:opacity-0
                        translate-x-0 sm:translate-x-2
                        sm:group-hover:opacity-100 sm:group-hover:translate-x-0
                        transition-all duration-200
                      "
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        href={`/dashboard/jobs/${job.id}`}  
                      >
                        <Button
                          variant="ghost"
                          className="h-8 px-3 text-muted-foreground hover:text-foreground"
                        >
                          View
                        </Button>
                        
                      </Link>

                      {can(user, "job:update") && (
                        <Button
                          onClick={() => handleToggle(job)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {job.status === "OPEN" ? "Close" : "Reopen"}
                        </Button>
                      )}      
                      
                      {can(user, "job:delete") && (
                        <ConfirmDialog
                          title="Delete this job?"
                          description="This will permanently delete the job."
                          onConfirm={() => handleDelete(job.id)}
                          confirmText="Delete"
                          variant="destructive"
                        >
                          <Button
                            className="text-red-500 hover:text-red-600"
                          >
                            Delete
                          </Button>
                        </ConfirmDialog>
                      )}

                      
                    </div>

                  </div>
                </div>
              ))}

            </div>
            </div>

            
            

          </CardContent>
        </Card>
      )}
      {/* PAGINATION */}
      {meta && meta.totalPages > 1 && (
        <div className="
          mt-4 sm:mt-6
          flex flex-col sm:flex-row gap-3 sm:gap-0
          justify-between items-center
        ">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>

          <div className="flex gap-2 flex-wrap justify-center">
            {[...Array(meta.totalPages)]
              .slice(0, 5)
              .map((_, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant={page === i + 1 ? "default" : "outline"}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
          </div>

          <Button
            variant="outline"
            disabled={page === meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>

        </div>
      )}

    </main>
  );
}