import { useEffect, useMemo,useState } from "react"
import { toast } from "sonner"

import { TASK_STATUS_VALUES } from "@/lib/constants/tasks"
import {
    type CreateTaskInput,
    DEFAULT_SORT,
    DEFAULT_STATUS_FILTER,
    SORT_OPTIONS,
    type SortOption,
    type Task,
    type TaskStatus,
} from "@/lib/types/task"
import { taskService } from "@/services/tasks"

export const useTasks = (initialTasks?: Task[]) => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks || [])
    const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">(
        DEFAULT_STATUS_FILTER
    )
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState<SortOption>(DEFAULT_SORT)
    const [loading, setLoading] = useState(!initialTasks)

    const performAction = async <T>(
        action: () => Promise<{ data?: T | null; error?: unknown }>,
        options: {
            successTitle?: string
            successDesc?: string
            errorTitle?: string
            onSuccess?: (data: T) => void
        } = {}
    ) => {
        try {
            const { data, error } = await action()
            if (error) throw error

            if (options.successTitle) {
                toast.success(options.successTitle, {
                    description: options.successDesc,
                })
            }

            if (options.onSuccess) {
                options.onSuccess(data!)
            }

            return data
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Unknown error"
            toast.error(options.errorTitle || "An error occurred", {
                description: errorMessage,
            })
            throw err
        }
    }

    useEffect(() => {
        if (!initialTasks) {
            fetchTasks()
        }
    }, [initialTasks])

    const fetchTasks = async () => {
        try {
            setLoading(true)
            const { data, error } = await taskService.getTasks()
            if (error) throw error
            setTasks(data || [])
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Unknown error"
            toast.error("Error fetching tasks", { description: errorMessage })
        } finally {
            setLoading(false)
        }
    }

    const filteredTasks = useMemo(() => {
        let result = tasks

        if (statusFilter !== DEFAULT_STATUS_FILTER) {
            result = result.filter((task) => task.status === statusFilter)
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (task) =>
                    task.title.toLowerCase().includes(query) ||
                    (task.description &&
                        task.description.toLowerCase().includes(query))
            )
        }

        result = [...result].sort((a, b) => {
            switch (sortBy) {
                case SORT_OPTIONS.DATE_ASC:
                    if (!a.due_date) return 1
                    if (!b.due_date) return -1
                    return (
                        new Date(a.due_date).getTime() -
                        new Date(b.due_date).getTime()
                    )
                case SORT_OPTIONS.DATE_DESC:
                    if (!a.due_date) return 1
                    if (!b.due_date) return -1
                    return (
                        new Date(b.due_date).getTime() -
                        new Date(a.due_date).getTime()
                    )
                case SORT_OPTIONS.CREATED_ASC:
                    return (
                        new Date(a.created_at).getTime() -
                        new Date(b.created_at).getTime()
                    )
                case SORT_OPTIONS.CREATED_DESC:
                    return (
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    )
                default:
                    return 0
            }
        })

        return result
    }, [tasks, statusFilter, searchQuery, sortBy])

    const createTask = async (input: CreateTaskInput) => {
        return performAction(() => taskService.createTask(input), {
            successTitle: "Task created",
            successDesc: "Your task has been created successfully.",
            errorTitle: "Error creating task",
            onSuccess: (data) => setTasks([data!, ...tasks]),
        })
    }

    const updateTask = async (taskId: string, input: CreateTaskInput) => {
        return performAction(() => taskService.updateTask(taskId, input), {
            successTitle: "Task updated",
            successDesc: "Your task has been updated successfully.",
            errorTitle: "Error updating task",
            onSuccess: (data) =>
                setTasks(tasks.map((t) => (t.id === taskId ? data! : t))),
        })
    }

    const deleteTask = async (taskId: string) => {
        return performAction(() => taskService.deleteTask(taskId), {
            successTitle: "Task deleted",
            successDesc: "Your task has been deleted successfully.",
            errorTitle: "Error deleting task",
            onSuccess: () => setTasks(tasks.filter((t) => t.id !== taskId)),
        })
    }

    const toggleComplete = async (taskId: string, isCompleted: boolean) => {
        const updates = {
            is_completed: isCompleted,
            status: (isCompleted
                ? TASK_STATUS_VALUES.DONE
                : TASK_STATUS_VALUES.TODO) as TaskStatus,
            end_date: isCompleted ? new Date().toISOString() : null,
        }

        const previousTasks = [...tasks]
        setTasks(tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)))

        try {
            await performAction(() => taskService.updateTask(taskId, updates), {
                errorTitle: "Error updating task",
            })
        } catch {
            setTasks(previousTasks)
        }
    }

    const updateStatus = async (taskId: string, status: TaskStatus) => {
        const isCompleted = status === TASK_STATUS_VALUES.DONE
        const updates = {
            status,
            is_completed: isCompleted,
            end_date: isCompleted ? new Date().toISOString() : null,
        }

        const previousTasks = [...tasks]
        setTasks(tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)))

        try {
            await performAction(() => taskService.updateTask(taskId, updates), {
                errorTitle: "Error updating task status",
            })
        } catch {
            setTasks(previousTasks)
        }
    }

    return {
        tasks: filteredTasks,
        allTasks: tasks,
        loading,
        statusFilter,
        setStatusFilter,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        createTask,
        updateTask,
        deleteTask,
        toggleComplete,
        updateStatus,
        refreshTasks: fetchTasks,
    }
}
