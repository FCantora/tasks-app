import { CheckCircle2, Circle, Clock, RotateCcw, Search } from "lucide-react"

import {
    Button,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui"
import {
    TASK_STATUS_LABELS,
    TASK_STATUS_VALUES,
    TASK_STATUSES,
} from "@/lib/constants/tasks"
import {
    DEFAULT_SORT,
    DEFAULT_STATUS_FILTER,
    SORT_OPTIONS,
    SortOption,
    TaskStatus,
} from "@/lib/types/task"

const STATUS_ICONS = {
    [TASK_STATUS_VALUES.TODO]: Circle,
    [TASK_STATUS_VALUES.IN_PROGRESS]: Clock,
    [TASK_STATUS_VALUES.DONE]: CheckCircle2,
} as const

const filters = [
    { value: DEFAULT_STATUS_FILTER, label: "All", icon: Circle },
    ...TASK_STATUSES.map((status) => ({
        value: status,
        label: TASK_STATUS_LABELS[status],
        icon: STATUS_ICONS[status],
    })),
] as const

interface Props {
    statusFilter: TaskStatus | "all"
    onStatusFilterChange: (status: TaskStatus | "all") => void
    searchQuery: string
    onSearchChange: (query: string) => void
    sortBy: SortOption
    onSortChange: (sort: SortOption) => void
    onReset: () => void
}

export const TaskControls = ({
    statusFilter,
    onStatusFilterChange,
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    onReset,
}: Props) => {
    const isFiltered =
        statusFilter !== DEFAULT_STATUS_FILTER ||
        searchQuery !== "" ||
        sortBy !== DEFAULT_SORT

    return (
        <div className="flex flex-col items-start justify-between gap-4 px-2 sm:flex-row sm:items-center">
            <div className="flex w-full flex-wrap items-center justify-between sm:gap-2 sm:w-auto">
                <span className="text-muted-foreground mr-1 hidden text-sm font-medium sm:inline">
                    Filter:
                </span>
                {filters.map((filter) => {
                    const Icon = filter.icon
                    const isActive = statusFilter === filter.value
                    return (
                        <Button
                            key={filter.value}
                            variant={isActive ? "default" : "outline"}
                            size="sm"
                            onClick={() => onStatusFilterChange(filter.value)}
                            className={`h-9 px-3 font-medium transition-all ${isActive ? "shadow-sm" : "hover:border-primary/50"}`}
                        >
                            <Icon className="mr-1.5 h-4 w-4" />
                            <span>{filter.label}</span>
                        </Button>
                    )
                })}
            </div>

            <div className="flex w-full flex-1 flex-col items-center justify-end gap-2 sm:w-auto sm:flex-row">
                <div className="relative w-full sm:max-w-[200px]">
                    <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" aria-hidden="true" />
                    <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="h-9 pl-9"
                        aria-label="Search tasks"
                    />
                </div>

                <div className="flex w-full items-center gap-2 sm:w-auto">
                    <label className="text-muted-foreground hidden text-sm font-medium whitespace-nowrap sm:inline" aria-hidden="true">
                        Sort:
                    </label>
                    <Select
                        value={sortBy}
                        onValueChange={(value) =>
                            onSortChange(value as SortOption)
                        }
                    >
                        <SelectTrigger className="h-9 w-full sm:w-[150px]" aria-label="Sort tasks">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={SORT_OPTIONS.CREATED_DESC}>Newest</SelectItem>
                            <SelectItem value={SORT_OPTIONS.CREATED_ASC}>Oldest</SelectItem>
                            <SelectItem value={SORT_OPTIONS.DATE_DESC}>
                                Due Date (Far)
                            </SelectItem>
                            <SelectItem value={SORT_OPTIONS.DATE_ASC}>
                                Due Date (Soon)
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="bg-border hidden h-6 w-px sm:ml-5 sm:block" />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onReset}
                    disabled={!isFiltered}
                    className="text-muted-foreground hover:text-foreground h-9 w-auto shrink-0 px-2 sm:w-9 sm:px-0"
                    title="Reset filters"
                    aria-label="Reset filters"
                >
                    <RotateCcw
                        className={`h-4 w-4 ${isFiltered ? "text-primary hover:text-primary/80" : ""}`}
                        aria-hidden="true"
                    />
                    <span className="ml-2 text-xs sm:hidden">
                        Reset all filters
                    </span>
                </Button>
            </div>
        </div>
    )
}
