import PipelineColumn from "./PipelineColumn"
import { DndContext } from "@dnd-kit/core"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {updateCandidateStatus} from "@/lib/api/candidates.api"
import {toast} from "sonner"

const STATUSES = [
    "APPLIED",
    "SCREENING",
    "INTERVIEW",
    "OFFER",
    "HIRED",
    "REJECTED"
]

export default function PipelineBoard({pipeline, jobId, search}){

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: ({candidateId, status})=>
            updateCandidateStatus(candidateId, status),

        //optiimistic update
        async onMutate({candidateId, status}) {
            await queryClient.cancelQueries(["pipeline", jobId])
            const previousData = queryClient.getQueryData(["pipeline",jobId])

            queryClient.setQueryData(["pipeline", jobId], (oldData) => {
                if(!oldData) return oldData

                const newPipeline= {...oldData.pipeline}
                let movedCandidate = null
                // remove candidatate from old stage
                for(const stage in newPipeline){
                    newPipeline[stage] = newPipeline[stage].filter((c)=>{
                        if(c.id === candidateId){
                            movedCandidate = {...c, status}
                            return false
                        }
                        return true
                    })
                }
                //add candidate to next stage
                if(movedCandidate){
                    newPipeline[status] = [ ...(newPipeline[status] || []), movedCandidate]
                }
                return {
                    ...oldData, pipeline: newPipeline
                }
            })
            return {previousData}
        },

        onError(err, variables, context){
            queryClient.setQueryData(
                ["pipeline", jobId],
                context.previousData
            )
            toast.error("Failed to update candidate stage")
        },
                    
        onSuccess(_ , variables){
            toast.success(`Candidate moved to ${variables.status}`)
        },
        onSettled(){
            queryClient.invalidateQueries(["pipeline", jobId])
        },

    })

    function handleDragEnd(event){
        const {active, over} = event

        if(!over) return 
        const candidateId = active.id
        const newStatus = over.id

        const oldStatus = active.data.current.candidate.status
        if(oldStatus === newStatus) return

        mutation.mutate({candidateId, status: newStatus})

    }
    return (
        <DndContext onDragEnd={handleDragEnd}>

            {/* BOARD WRAPPER */}
            <div className="
              w-full 
              overflow-x-auto 
              pb-6
              px-1
              relative

            bg-gradient-to-br from-emerald-50 via-white to-blue-50
            rounded-2xl

            scrollbar-thin
            scrollbar-thumb-zinc-300
            hover:scrollbar-thumb-zinc-400

            scroll-smooth
            ">
                
                {/* LEFT FADE */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />

                {/* RIGHT FADE */}
                <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

            {/* INNER CANVAS */}
            <div className="
                flex gap-5 min-w-max
                px-2 transition-all duration-300
            ">

                {STATUSES.map((status) => (
                <PipelineColumn 
                    key={status}
                    title={status}
                    candidates={pipeline?.[status] || []}
                    jobId={jobId}
                    search={search}
                />
                ))}

            </div>

            </div>

        </DndContext>
    )
}