export type TaskStatus = "todo" | "in_progress" | "done"

export interface Task {
    id: string
    user_id: string
    title: string
    description: string | null
    status: TaskStatus
    is_completed: boolean
    due_date: string | null
    start_date: string | null
    end_date: string | null
    created_at: string
}

export interface CreateTaskInput {
    title: string
    description?: string | null
    status?: TaskStatus
    due_date?: string | null
    start_date?: string | null
    end_date?: string | null
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
    is_completed?: boolean
}

export type SortOption =
    | "date_desc"
    | "date_asc"
    | "created_desc"
    | "created_asc"

export const SORT_OPTIONS = {
    DATE_DESC: "date_desc",
    DATE_ASC: "date_asc",
    CREATED_DESC: "created_desc",
    CREATED_ASC: "created_asc",
} as const

export const DEFAULT_SORT: SortOption = "created_desc"
export const DEFAULT_STATUS_FILTER = "all"

