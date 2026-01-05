"use client"

import { Task, TaskStatus } from "@/lib/types/task"
import { Badge } from "./ui/badge"
import { TaskCard } from "./task-card"
import { cn } from "@/lib/utils"
import { TASK_STATUS_COLORS, TASK_STATUS_LABELS, TASK_STATUSES } from "@/lib/constants/tasks"
import { useKanbanDrag } from "@/hooks/use-kanban-drag"

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

export const TaskKanban = ({ tasks, onEdit, onDelete, onToggleComplete, onUpdateStatus, statusFilter = "all" }: Props) => {
    const {
        draggedTaskId,
        dragOverColumn,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop
    } = useKanbanDrag({ onUpdateStatus })

    const visibleColumns = statusFilter === "all"
        ? columnsDefinitions
        : columnsDefinitions.filter(col => col.id === statusFilter)

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
    onToggleComplete
}: KanbanColumnProps) => {
    return (
        <div
            className={cn(
                "flex h-full min-w-[300px] flex-1 flex-col rounded-lg border bg-background transition-colors",
                isDragOver && "border-primary/50 bg-muted/50"
            )}
            onDragOver={(e) => onDragOver(e, column.id)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, column.id)}
        >
            <div className={cn("flex items-center justify-between border-b p-4", column.color)}>
                <h3 className="font-semibold">{column.title}</h3>
                <Badge variant="secondary" className="rounded-full">
                    {tasks.length}
                </Badge>
            </div>

            <div className="flex-1 p-4 overflow-y-auto min-h-0">
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
                        <div className="flex h-24 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                            No tasks
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
