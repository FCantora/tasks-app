import { TimelineTask, useTimelineCalculations } from "@/hooks/use-timeline-calculations"
import { TASK_STATUS_VALUES } from "@/lib/constants/tasks"
import { Task } from "@/lib/types/task"
import { cn } from "@/lib/utils"

import { TaskCard } from "./task-card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"

interface Props {
    tasks: Task[]
    onEdit: (task: Task) => void
    onDelete: (taskId: string) => void
    onToggleComplete: (taskId: string, isCompleted: boolean) => void
}

export const TaskTimeline = ({
    tasks,
    onEdit,
    onDelete,
    onToggleComplete,
}: Props) => {
    const { timelineTasks, range, headers, months, getPosition } =
        useTimelineCalculations(tasks)

    if (tasks.length === 0) {
        return (
            <div className="text-muted-foreground m-4 flex h-64 flex-col items-center justify-center rounded-lg border">
                No tasks to display
            </div>
        )
    }

    return (
        <div className="bg-background relative my-4 flex h-full flex-col overflow-hidden rounded-lg border">
            <TimelineLegend />

            <div className="relative flex-1 overflow-x-auto overflow-y-auto">
                <div
                    className="relative min-w-[800px] pb-8"
                    style={{ width: `${Math.max(100, range.totalDays * 5)}%` }}
                >
                    <div className="sticky top-0 z-10 shadow-sm">
                        <TimelineHeader months={months} headers={headers} />
                    </div>

                    {/* Grid Lines */}
                    <div className="pointer-events-none absolute inset-0 top-[65px] flex">
                        {headers.map((_, i) => (
                            <div
                                key={i}
                                className="h-full flex-1 border-r border-dashed border-gray-100 dark:border-gray-800"
                            ></div>
                        ))}
                    </div>

                    {/* Task Rows */}
                    <div className="mt-2 space-y-2 p-2">
                        {timelineTasks.map((task) => (
                            <TimelineTaskRow
                                key={task.id}
                                task={task}
                                position={getPosition(
                                    task.effectiveStart,
                                    task.effectiveEnd
                                )}
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
    <div className="bg-muted/20 flex items-center justify-between border-b p-4">
        <h3 className="font-semibold">Project Timeline</h3>
        <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-sm bg-blue-500"></div> In
                Progress
            </div>
            <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-sm bg-green-500"></div> Done
            </div>
            <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-sm bg-gray-400"></div> Todo
            </div>
        </div>
    </div>
)

const TimelineHeader = ({
    months,
    headers,
}: {
    months: { label: string; count: number }[]
    headers: Date[]
}) => (
    <>
        {/* Month Headers */}
        <div className="bg-muted/40 flex border-b">
            {months.map((m, i) => (
                <div
                    key={i}
                    className="text-muted-foreground truncate border-r px-2 py-1 text-center text-sm font-semibold"
                    style={{ flex: `${m.count} 0 0%` }}
                >
                    {m.label}
                </div>
            ))}
        </div>

        {/* Date Headers */}
        <div className="bg-background flex border-b">
            {headers.map((date, i) => (
                <div
                    key={i}
                    className="text-muted-foreground min-w-[40px] flex-1 border-r px-1 py-2 text-center text-xs select-none"
                >
                    <div className="font-bold">
                        {date.toLocaleDateString("en-US", { day: "numeric" })}
                    </div>
                    <div>
                        {date.toLocaleDateString("en-US", {
                            weekday: "narrow",
                        })}
                    </div>
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
    onToggleComplete,
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
                <div className="hover:bg-muted/30 group relative flex h-12 items-center rounded">
                    <div
                        className={cn(
                            "absolute flex h-8 cursor-pointer items-center gap-2 overflow-hidden rounded-md border px-2 shadow-sm transition-all hover:z-20 hover:brightness-95",
                            task.status === TASK_STATUS_VALUES.DONE
                                ? "border-green-200 bg-green-100 text-green-900 dark:border-green-800 dark:bg-green-900/30 dark:text-green-100"
                                : task.status === TASK_STATUS_VALUES.IN_PROGRESS
                                    ? "border-blue-200 bg-blue-100 text-blue-900 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-100"
                                    : "border-gray-200 bg-gray-100 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        )}
                        style={position}
                        onClick={() => onEdit(task)}
                    >
                        <span className="sticky left-0 truncate text-xs font-medium">
                            {task.title}
                        </span>
                    </div>
                </div>
            </HoverCardTrigger>
            <HoverCardContent
                className="w-80 p-0"
                align="start"
                sideOffset={10}
            >
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
