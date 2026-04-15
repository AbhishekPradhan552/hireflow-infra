import CandidateCard from "./CandidateCard"
import { useDroppable } from "@dnd-kit/core"
import { Search } from "lucide-react"


export default function PipelineColumn({ title, candidates, jobId, search }) {
  const { setNodeRef, isOver } = useDroppable({
    id: title,
  })
  
  const filtered = search
    ? candidates.filter((c) => {
      const query = search.toLowerCase()

      return (
        c.name?.toLowerCase().includes(query) ||
        c.email?.toLowerCase().includes(query)
      )
    })
    : candidates


  return (
  <div
    ref={setNodeRef}
    className={`
      w-[300px] flex-shrink-0 rounded-xl transition-all duration-200 ease-out snap-start


      ${
        isOver
          ? "bg-gradient-to-b from-blue-50/80 to-blue-100/80 border border-blue-300 shadow-lg"
          : "bg-white/40 backdrop-blur-sm border border-white/30 shadow-sm hover:shadow-md"
      }
    `}
  >

    {/* HEADER */}
    <div className="
      flex items-center justify-between 
      px-3 py-2 mb-2
      rounded-lg
      bg-white/70 backdrop-blur-md
      border border-white/40
      shadow-sm
    ">
      <h3 className="text-[11px] font-semibold tracking-wide uppercase text-zinc-600">
        {title}
      </h3>

      <span className="
        text-[11px] font-medium
        px-1.5 py-0.5 rounded-md
        bg-white/70 text-zinc-600 border border-white/40
      ">
        {filtered.length}
      </span>
    </div>

    {/* BODY */}
    <div className="
      p-2 space-y-3 
      min-h-[160px]
      rounded-lg
     
      bg-white/30 backdrop-blur-sm
      
    ">

      {filtered.map((candidate) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          jobId={jobId}
        />
      ))}

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <div className="
          flex flex-col items-center justify-center
          py-12 px-4 text-center space-y-3
          rounded-xl

          border border-dashed border-white/40
          bg-white/30 backdrop-blur-md

          transition-all
        ">

          {/* ICON */}
          <div className="
           w-10 h-10 flex items-center justify-center
          rounded-full
          bg-white/60
          border border-white/40
          shadow-sm
          ">
            <Search size={16} className="text-zinc-500" />
          </div>

          {/* TEXT */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-zinc-700">
              {search ? "No results found" : "No candidates"}
            </p>

            <p className="text-xs text-zinc-500">
              {search
                ? "Try a different name or email"
                : "Drag candidates here"}
            </p>
          </div>
          {/* SUBTLE ACTION HINT */}
          {!search && (
            <div className="text-[11px] text-zinc-400 mt-1">
              or update status from candidate page
            </div>
          )}

        </div>
      )}

    </div>
  </div>
)
}

