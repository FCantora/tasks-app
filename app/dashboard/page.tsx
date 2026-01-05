"use client";

import { DeleteTaskAlert } from "@/components/delete-task-alert";
import { TaskCard } from "@/components/task-card";
import { TaskDialog } from "@/components/task-dialog";
import { TaskFilters } from "@/components/task-filters";
import { Button } from "@/components/ui/button";
import type { CreateTaskInput, Task, TaskStatus } from "@/lib/types/task";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { taskService } from "../api/tasks";
import { TaskSkeleton } from "@/components/task-skeleton";

export default function DashboardPage() {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
    const [tasks, setTasks] = useState<Task[]>([])
    const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTasks()
    }, [])

    const filteredTasks = useMemo(() => {
        if (statusFilter === "all") return tasks
        return tasks.filter((task) => task.status === statusFilter)
    }, [tasks, statusFilter])

    const fetchTasks = async () => {
        try {
            const { data, error } = await taskService.getTasks()

            if (error) throw error
            setTasks(data || [])
        } catch (err) {
            const error = err as { message: string }
            toast.error("Error fetching tasks", {
                description: error.message,
            })
        } finally {
            setLoading(false)
        }
    }


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

    const handleUpdateTask = async (input: CreateTaskInput) => {
        if (!selectedTask) return

        try {
            const { data, error } = await taskService.updateTask(selectedTask.id, input)

            if (error) throw error

            setTasks(tasks.map((t) => (t.id === selectedTask.id ? data! : t)))
            toast("Task updated", {
                description: "Your task has been updated successfully.",
            })
        } catch (err) {
            const error = err as { message: string }
            toast.error("Error updating task", {
                description: error.message,
            })
            throw error
        }
    }

    const handleCreateTask = async (input: CreateTaskInput) => {
        try {
            const { data, error } = await taskService.createTask(input)

            if (error) throw error

            setTasks([data!, ...tasks])
            toast("Task created", {
                description: "Your task has been created successfully.",
            })
        } catch (err) {
            const error = err as { message: string }
            toast.error("Error creating task", {
                description: error.message,
            })
            throw error
        }
    }

    const handleDeleteTask = async () => {
        if (!taskToDelete) return

        setDeleteLoading(true)
        try {
            const { error } = await taskService.deleteTask(taskToDelete)

            if (error) throw error

            setTasks(tasks.filter((t) => t.id !== taskToDelete))
            toast("Task deleted", {
                description: "Your task has been deleted successfully.",
            })
            setDeleteAlertOpen(false)
            setTaskToDelete(null)
        } catch (err) {
            const error = err as { message: string }
            toast.error("Error deleting task", {
                description: error.message,
            })
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleToggleComplete = async (taskId: string, isCompleted: boolean) => {
        try {
            const { error } = await taskService.updateTask(taskId, { is_completed: isCompleted })

            if (error) throw error

            setTasks(tasks.map((t) => (t.id === taskId ? { ...t, is_completed: isCompleted } : t)))
        } catch (err) {
            const error = err as { message: string }
            toast.error("Error updating task", {
                description: error.message,
            })
        }
    }

    return (
        <main className="bg-background">
            <div className="container max-w-7xl mx-auto px-4 py-6 sm:py-8">
                <div className="flex flex-col gap-4 mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-balance">My Tasks</h1>
                            <p className="text-muted-foreground mt-1.5 sm:mt-2">
                                {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
                                {statusFilter !== "all" && " matching filter"}
                            </p>
                        </div>
                        <Button onClick={openCreateDialog} size="lg" className="h-11 px-6 font-semibold shadow-sm w-full sm:w-auto">
                            <Plus className="h-5 w-5 mr-2" />
                            New Task
                        </Button>
                    </div>

                    <TaskFilters statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} />
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <TaskSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
                        <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Plus className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-center">
                            {tasks.length === 0 ? "No tasks yet" : "No tasks found"}
                        </h2>
                        <p className="text-muted-foreground text-center mb-6 max-w-sm text-balance text-sm sm:text-base">
                            {tasks.length === 0
                                ? "Get started by creating your first task to stay organized and productive."
                                : "Try adjusting your filters to see more tasks."}
                        </p>
                        {tasks.length === 0 && (
                            <Button onClick={openCreateDialog} size="lg" className="h-11 px-6 font-semibold">
                                <Plus className="h-5 w-5 mr-2" />
                                Create Your First Task
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={openEditDialog}
                                onDelete={openDeleteAlert}
                                onToggleComplete={handleToggleComplete}
                            />
                        ))}
                    </div>
                )}
            </div>
            <TaskDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSave={selectedTask ? handleUpdateTask : handleCreateTask}
                task={selectedTask}
            />

            <DeleteTaskAlert
                open={deleteAlertOpen}
                onOpenChange={setDeleteAlertOpen}
                onConfirm={handleDeleteTask}
                loading={deleteLoading}
            />

        </main>
    );
}
