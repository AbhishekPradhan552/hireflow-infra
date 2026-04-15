import Link from "next/link"
import ScoreBadge from "@/components/ScoreBadge"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"



export default function CandidateCard ({candidate, jobId}){
    const{
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging
    } = useDraggable({
        id: candidate.id,
        data:{candidate}
    })

    const style = {
        transform: CSS.Translate.toString(transform),
    }
    
    
    return (
  <div
  ref={setNodeRef}
  style={style}
  className={`
    backdrop-blur-md
    bg-white/70
    border border-white/40
    rounded-xl
    px-3 py-3

    shadow-[0_4px_20px_rgba(0,0,0,0.04)]
    transition-all duration-200

    ${
      isDragging
        ? "opacity-70 scale-[0.96] shadow-xl border-blue-200 bg-blue-50/70"
        : "hover:shadow-md hover:-translate-y-[2px] hover:bg-white/80"
    }
  `}
>
  <div className="flex items-start gap-3">

    {/* DRAG HANDLE */}
    <div
      {...listeners}
      {...attributes}
      className="
        cursor-grab active:cursor-grabbing
        text-zinc-400 mt-1
        opacity-70 hover:opacity-100 transition
      "
    >
      <GripVertical size={16} />
    </div>

    {/* CONTENT */}
    <div className="flex-1 min-w-0">

      <p className="font-semibold text-sm text-zinc-900 leading-tight truncate">
        {candidate.name}
      </p>

      <p className="text-xs text-zinc-500 mt-1 truncate">
        {candidate.email}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <ScoreBadge score={candidate.hybridScore} />

        <Link
          href={`/dashboard/jobs/${jobId}/candidates/${candidate.id}`}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 transition"
        >
          View →
        </Link>
      </div>

    </div>
  </div>
</div>
)


}