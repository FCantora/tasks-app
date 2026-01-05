"use client"

import { Task } from "@/lib/types/task"
import { cn } from "@/lib/utils"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"
import { TaskCard } from "./task-card"
import { useTimelineCalculations, TimelineTask } from "@/hooks/use-timeline-calculations"

interface Props {
    tasks: Task[]
    onEdit: (task: Task) => void
    onDelete: (taskId: string) => void
    onToggleComplete: (taskId: string, isCompleted: boolean) => void
}

export const TaskTimeline = ({ tasks, onEdit, onDelete, onToggleComplete }: Props) => {
    const { timelineTasks, range, headers, months, getPosition } = useTimelineCalculations(tasks)

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border rounded-lg m-4">
                No tasks to display
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col border rounded-lg my-4 bg-background overflow-hidden relative">
            <TimelineLegend />

            <div className="flex-1 overflow-x-auto overflow-y-auto relative">
                <div className="min-w-[800px] relative pb-8" style={{ width: `${Math.max(100, range.totalDays * 5)}%` }}>

                    <div className="sticky top-0 z-10 shadow-sm">
                        <TimelineHeader months={months} headers={headers} />
                    </div>

                    {/* Grid Lines */}
                    <div className="absolute inset-0 top-[65px] flex pointer-events-none">
                        {headers.map((_, i) => (
                            <div key={i} className="flex-1 border-r border-dashed border-gray-100 dark:border-gray-800 h-full"></div>
                        ))}
                    </div>

                    {/* Task Rows */}
                    <div className="p-2 space-y-2 mt-2">
                        {timelineTasks.map(task => (
                            <TimelineTaskRow
                                key={task.id}
                                task={task}
                                position={getPosition(task.effectiveStart, task.effectiveEnd)}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onToggleComplete={onToggleComplete}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const TimelineLegend = () => (
    <div className="p-4 border-b flex items-center justify-between bg-muted/20">
        <h3 className="font-semibold">Project Timeline</h3>
        <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> In Progress</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> Done</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-400 rounded-sm"></div> Todo</div>
        </div>
    </div>
)

const TimelineHeader = ({
    months,
    headers
}: {
    months: { label: string; count: number }[]
    headers: Date[]
}) => (
    <>
        {/* Month Headers */}
        <div className="flex border-b bg-muted/40">
            {months.map((m, i) => (
                <div
                    key={i}
                    className="border-r px-2 py-1 text-sm font-semibold text-center truncate text-muted-foreground"
                    style={{ flex: `${m.count} 0 0%` }}
                >
                    {m.label}
                </div>
            ))}
        </div>

        {/* Date Headers */}
        <div className="flex border-b bg-background">
            {headers.map((date, i) => (
                <div key={i} className="flex-1 min-w-[40px] border-r px-1 py-2 text-xs text-center text-muted-foreground select-none">
                    <div className="font-bold">{date.toLocaleDateString('en-US', { day: 'numeric' })}</div>
                    <div>{date.toLocaleDateString('en-US', { weekday: 'narrow' })}</div>
                </div>
            ))}
        </div>
    </>
)

const TimelineTaskRow = ({
    task,
    position,
    onEdit,
    onDelete,
    onToggleComplete
}: {
    task: TimelineTask
    position: { left: string; width: string }
    onEdit: (task: Task) => void
    onDelete: (taskId: string) => void
    onToggleComplete: (taskId: string, isCompleted: boolean) => void
}) => {
    return (
        <HoverCard openDelay={200}>
            <HoverCardTrigger asChild>
                <div className="relative h-12 hover:bg-muted/30 rounded flex items-center group">
                    <div
                        className={cn(
                            "absolute h-8 rounded-md shadow-sm border px-2 flex items-center gap-2 overflow-hidden transition-all hover:brightness-95 hover:z-20 cursor-pointer",
                            task.status === "done" ? "bg-green-100 border-green-200 text-green-900 dark:bg-green-900/30 dark:border-green-800 dark:text-green-100" :
                                task.status === "in_progress" ? "bg-blue-100 border-blue-200 text-blue-900 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-100" :
                                    "bg-gray-100 border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                        )}
                        style={position}
                        onClick={() => onEdit(task)}
                    >
                        <span className="truncate text-xs font-medium sticky left-0">{task.title}</span>
                    </div>
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-0" align="start" sideOffset={10}>
                <TaskCard
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleComplete={onToggleComplete}
                />
            </HoverCardContent>
        </HoverCard>
    )
}
