import { TaskStatus } from "@/lib/types/task"

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done",
}

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
    todo: "bg-status-todo text-status-todo-fg",
    in_progress:
        "bg-status-inprogress text-status-inprogress-fg border-status-inprogress-border",
    done: "bg-status-done text-status-done-fg border-status-done-border",
}

export const TASK_STATUS_VALUES = {
    TODO: "todo",
    IN_PROGRESS: "in_progress",
    DONE: "done",
} as const

export const TASK_STATUSES: TaskStatus[] = [
    TASK_STATUS_VALUES.TODO,
    TASK_STATUS_VALUES.IN_PROGRESS,
    TASK_STATUS_VALUES.DONE,
]
