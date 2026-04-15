"use client";

import { useState , useEffect} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { getCandidatesByJob } from "@/lib/api/candidates.api";
import { getResumeDownloadUrl } from "@/lib/api/resumes.api";
import { getJobStats } from "@/lib/api/jobs.api";

import SearchInput from "@/components/ui/search-input";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import ScoreBadge from "@/components/ScoreBadge";
import UsageBar from "@/components/UsageBar";

export default function CandidatesPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const router = useRouter()
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = Number(process.env.NEXT_PUBLIC_RESUME_LIMIT) || 50;

  // Candidates Query
  const { data, isPending, isFetching, error } = useQuery({
    queryKey: ["candidates", id, page, search],
    queryFn: () =>
      getCandidatesByJob(id, {
        page,
        limit: 10,
        search,
      }),
    enabled: !!id,
    
  });
  useEffect(() => {
    if (data) setHasLoadedOnce(true);
  }, [data]);



  // Stats
  const { data: stats } = useQuery({
    queryKey: ["job-stats", id],
    queryFn: () => getJobStats(id),
    refetchInterval: false,
    enabled: !!id,
  });

  const candidates = data?.data || [];
  const meta = data?.meta;

  async function handleDownload(resumeId) {
    try {
      const res = await getResumeDownloadUrl(resumeId);
      window.open(res.url, "_blank");
    } catch {
      toast.error("Failed to download resume");
    }
  }

 

  if (error) return <p className="p-6">Failed to load candidates</p>;

  return (
   <div className="px-3 sm:px-6 py-4 sm:py-6 space-y-6 max-w-7xl mx-auto bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950 min-h-screen">

  {/* HEADER */}
  <div className="flex flex-col sm:flex-row
  gap-4 sm:gap-0
  sm:items-center sm:justify-between
  rounded-2xl px-4 sm:px-6 py-4 sm:py-5
  bg-white/70 backdrop-blur-md border border-zinc-200/60 shadow-sm 
  ">

    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        Candidates
      </h1>
      <p className="text-sm text-zinc-500 mt-1">
        Track and evaluate applicants for this job
      </p>
    </div>

    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
      <SearchInput
        value={search}
        onChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        placeholder="Search by name or email..."
        debounce={400}
        className="w-full sm:w-[260px] h-10 rounded-full bg-white/80 border border-zinc-200 backdrop-blur-sm focus:ring-2 focus:ring-black/5"
      />

      <Link href={`/dashboard/jobs/${id}/pipeline`}>
        <Button 
          variant="outline" 
          className="rounded-full px-4 h-10 border-zinc-300 bg-white/70 hover:bg-white"
        >
          Pipeline
        </Button>
      </Link>

      <Link href={`/dashboard/jobs/${id}/candidates/new`}>
        <Button className="rounded-full px-4 h-10 bg-black text-white hover:bg-black/90 shadow-sm">
          Add Candidate
        </Button>
      </Link>
    </div>
  </div>

  {/* USAGE */}
  <div className="bg-white/80 backdrop-blur-md border border-zinc-200/60 rounded-2xl p-5 shadow-sm">
    <UsageBar used={stats?.parsedResumes ?? 0} limit={limit} />
  </div>

  {/* TABLE */}
  <Card className="rounded-2xl border border-zinc-200/70 shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white overflow-hidden">
    <CardContent className="p-0">

      {!hasLoadedOnce ? (
        <div className="px-4 py-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-9 h-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>

      ) : candidates.length === 0 ? (

        <Empty className="py-20">
          <EmptyHeader>
            <Users className="mx-auto mb-2 h-6 w-6 text-zinc-400" />
            <EmptyTitle>
              {search
                ? "No matching applicants found"
                : "No applicants yet"}
            </EmptyTitle>
            <EmptyDescription>
              {search
                ? `No results for "${search}"`
                : "Applicants will appear here after applying"}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>

      ) : (
        <>
          {/* INFO */}
          <div className="px-4 py-2 text-xs text-zinc-500">
            Showing {candidates.length} of {meta?.total} applicants
          </div>

          <div className="relative">
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow className="bg-zinc-100 border-b border-zinc-200 ">
                  <TableHead className="p-4 text-xs font-semibold text-zinc-500 uppercase">
                    Candidate
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-500 uppercase">
                    Score
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-500 uppercase">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-500 uppercase">
                    Resume
                  </TableHead>
                  <TableHead className="text-right pr-4 text-xs font-semibold text-zinc-500 uppercase">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow
                    key={candidate.id}
                    onClick={() =>
                      router.push(`/dashboard/jobs/${id}/candidates/${candidate.id}`)
                    }
                    className="
                      group
                      cursor-pointer
                      transition-all duration-200 ease-out
                      border-b border-zinc-100/80                     
                      hover:bg-white
                      hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)]
                      hover:-translate-y-[2px]
                    "
                  >
                    {/* CANDIDATE */}
                    <TableCell className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-200/80 flex items-center justify-center text-sm font-semibold text-zinc-700">
                          {candidate.name?.[0]?.toUpperCase() || "?"}
                        </div>

                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-zinc-900 leading-none">
                            {candidate.name}
                          </span>
                          <span className="text-xs text-zinc-500 mt-1">
                            {candidate.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* SCORE */}
                    <TableCell className="align-middle">
                      {candidate.hybridScore !== null ? (
                        <div className="flex items-center gap-2 bg-zinc-100 px-2 py-[2px] rounded-md w-fit">
                          <ScoreBadge score={candidate.hybridScore} />
                          <span className="text-xs text-zinc-500">
                            {candidate.hybridScore >= 80
                              ? "Strong"
                              : candidate.hybridScore >= 60
                              ? "Decent"
                              : "Weak"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-zinc-400">
                          Not scored
                        </span>
                      )}
                    </TableCell>

                    {/* STATUS */}
                    <TableCell className="align-middle">
                      <span
                        className={`text-xs px-2 py-[3px] rounded-full font-semibold border  ${
                          candidate.parseStatus === "COMPLETED"
                            ? "bg-green-50/70 text-green-700 border-green-200"
                            : candidate.parseStatus === "PENDING"
                            ? "bg-yellow-50/70 text-yellow-700 border-yellow-200"
                            : "bg-zinc-100/70 text-zinc-600 border-zinc-200"
                        }`}
                      >
                        {candidate.parseStatus === "PENDING"
                          ? "Processing"
                          : candidate.parseStatus === "COMPLETED"
                          ? "Completed"
                          : "Not started"}
                      </span>
                    </TableCell>

                    {/* RESUME */}
                    <TableCell className="align-middle">
                      {candidate.resumeCount > 0 ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(candidate.bestResumeId);
                            }}
                            className="text-blue-600 text-sm font-medium hover:underline"
                          >
                            Download
                          </button>

                          <span className="text-xs text-zinc-500">
                            {candidate.resumeCount} files
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-zinc-400">
                          No resume
                        </span>
                      )}
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell className="text-right pr-4 align-middle">
                      <div className="flex justify-end gap-4 text-sm opacity-70 group-hover:opacity-100 transition">
                        <Link
                          href={`/dashboard/jobs/${id}/candidates/${candidate.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </Link>

                        <Link
                          href={`/dashboard/jobs/${id}/candidates/${candidate.id}/edit`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-zinc-500 hover:text-zinc-900"
                        >
                          Edit
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
            

            {isFetching && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full px-4 space-y-3 opacity-60">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 w-full rounded-md bg-zinc-200 animate-pulse"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* PAGINATION */}
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-xs text-zinc-500">
                Page {meta?.page} of {meta?.totalPages}
              </p>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="h-8 px-3"
                >
                  ←
                </Button>

                <div className="h-8 px-3 flex items-center text-sm font-medium bg-zinc-100 rounded-md">
                  {meta?.page}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page === meta?.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-8 px-3"
                >
                  →
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </CardContent>
  </Card>
</div>
  );
}