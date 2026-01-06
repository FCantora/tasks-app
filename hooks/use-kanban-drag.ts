import { useState } from "react"

import { TaskStatus } from "@/lib/types/task"

interface Props {
    onUpdateStatus: (taskId: string, status: TaskStatus) => void
}

export const useKanbanDrag = ({ onUpdateStatus }: Props) => {
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
    const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(
        null
    )

    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        setDraggedTaskId(taskId)
        e.dataTransfer.effectAllowed = "move"
    }

    const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
        e.preventDefault()
        setDragOverColumn(status)
    }

    const handleDragLeave = () => {
        setDragOverColumn(null)
    }

    const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
        e.preventDefault()
        if (draggedTaskId) {
            onUpdateStatus(draggedTaskId, status)
        }
        setDraggedTaskId(null)
        setDragOverColumn(null)
    }

    return {
        draggedTaskId,
        dragOverColumn,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop,
    }
}
