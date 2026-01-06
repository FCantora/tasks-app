import { useKanbanDrag } from "@/hooks/use-kanban-drag"
import {
    TASK_STATUS_COLORS,
    TASK_STATUS_LABELS,
    TASK_STATUSES,
} from "@/lib/constants/tasks"
import { Task, TaskStatus } from "@/lib/types/task"
import { DEFAULT_STATUS_FILTER } from "@/lib/types/task"
import { cn } from "@/lib/utils"

import { TaskCard } from "./task-card"
import { Badge } from "./ui/badge"

interface Props {
    tasks: Task[]
    onEdit: (task: Task) => void
    onDelete: (taskId: string) => void
    onToggleComplete: (taskId: string, isCompleted: boolean) => void
    onUpdateStatus: (taskId: string, status: TaskStatus) => void
    statusFilter?: TaskStatus | "all"
}

const columnsDefinitions = TASK_STATUSES.map((status) => ({
    id: status,
    title: TASK_STATUS_LABELS[status],
    color: TASK_STATUS_COLORS[status],
}))

export const TaskKanban = ({
    tasks,
    onEdit,
    onDelete,
    onToggleComplete,
    onUpdateStatus,
    statusFilter = DEFAULT_STATUS_FILTER,
}: Props) => {
    const {
        draggedTaskId,
        dragOverColumn,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop,
    } = useKanbanDrag({ onUpdateStatus })

    const visibleColumns =
        statusFilter === DEFAULT_STATUS_FILTER
            ? columnsDefinitions
            : columnsDefinitions.filter((col) => col.id === statusFilter)

    return (
        <div className="flex h-full gap-4 overflow-x-auto pb-4">
            {visibleColumns.map((column) => (
                <KanbanColumn
                    key={column.id}
                    column={column}
                    tasks={tasks.filter((t) => t.status === column.id)}
                    draggedTaskId={draggedTaskId}
                    isDragOver={dragOverColumn === column.id}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleComplete={onToggleComplete}
                />
            ))}
        </div>
    )
}

interface KanbanColumnProps {
    column: { id: TaskStatus; title: string; color: string }
    tasks: Task[]
    draggedTaskId: string | null
    isDragOver: boolean
    onDragStart: (e: React.DragEvent, taskId: string) => void
    onDragOver: (e: React.DragEvent, status: TaskStatus) => void
    onDragLeave: () => void
    onDrop: (e: React.DragEvent, status: TaskStatus) => void
    onEdit: (task: Task) => void
    onDelete: (taskId: string) => void
    onToggleComplete: (taskId: string, isCompleted: boolean) => void
}

const KanbanColumn = ({
    column,
    tasks,
    draggedTaskId,
    isDragOver,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onEdit,
    onDelete,
    onToggleComplete,
}: KanbanColumnProps) => {
    return (
        <div
            className={cn(
                "bg-background flex h-full min-w-[300px] flex-1 flex-col rounded-lg border transition-colors",
                isDragOver && "border-primary/50 bg-muted/50"
            )}
            onDragOver={(e) => onDragOver(e, column.id)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, column.id)}
        >
            <div
                className={cn(
                    "flex items-center justify-between border-b p-4",
                    column.color
                )}
            >
                <h3 className="font-semibold">{column.title}</h3>
                <Badge variant="secondary" className="rounded-full">
                    {tasks.length}
                </Badge>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <div className="flex flex-col gap-3">
                    {tasks.map((task) => (
                        <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => onDragStart(e, task.id)}
                            className={cn(
                                "cursor-grab active:cursor-grabbing",
                                draggedTaskId === task.id && "opacity-50"
                            )}
                        >
                            <TaskCard
                                task={task}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onToggleComplete={onToggleComplete}
                            />
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div className="text-muted-foreground flex h-24 items-center justify-center rounded-lg border border-dashed text-sm">
                            No tasks
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
