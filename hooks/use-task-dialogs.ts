import { useState } from "react"

import { Task } from "@/lib/types/task"

export const useTaskDialogs = () => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const openCreateDialog = () => {
        setSelectedTask(null)
        setDialogOpen(true)
    }

    const openEditDialog = (task: Task) => {
        setSelectedTask(task)
        setDialogOpen(true)
    }

    const openDeleteAlert = (taskId: string) => {
        setTaskToDelete(taskId)
        setDeleteAlertOpen(true)
    }

    const closeDeleteAlert = () => {
        setDeleteAlertOpen(false)
        setTaskToDelete(null)
    }

    return {
        dialogOpen,
        setDialogOpen,
        selectedTask,
        taskToDelete,
        deleteAlertOpen,
        setDeleteAlertOpen,
        deleteLoading,
        setDeleteLoading,
        openCreateDialog,
        openEditDialog,
        openDeleteAlert,
        closeDeleteAlert,
    }
}
