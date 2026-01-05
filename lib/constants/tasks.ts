import { TaskStatus } from "@/lib/types/task"

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done",
}

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
    todo: "bg-status-todo text-status-todo-fg",
    in_progress: "bg-status-inprogress text-status-inprogress-fg border-status-inprogress-border",
    done: "bg-status-done text-status-done-fg border-status-done-border",
}

export const TASK_STATUSES: TaskStatus[] = ["todo", "in_progress", "done"]
