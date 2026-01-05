"use client"

import { CheckCircle2, Circle, Clock, RotateCcw, Search } from "lucide-react"
import { TaskStatus } from "@/lib/types/task"
import {
    Button,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui"

export type SortOption =
    | "date_desc"
    | "date_asc"
    | "created_desc"
    | "created_asc"

const filters = [
    { value: "all", label: "All", icon: Circle },
    { value: "todo", label: "To Do", icon: Circle },
    { value: "in_progress", label: "In Progress", icon: Clock },
    { value: "done", label: "Done", icon: CheckCircle2 },
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
        statusFilter !== "all" ||
        searchQuery !== "" ||
        sortBy !== "created_desc"

    return (
        <div className="flex flex-col items-start justify-between gap-4 px-2 sm:flex-row sm:items-center">
            <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:w-auto">
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
                {/* Search */}
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

                {/* Sort */}
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
                            <SelectItem value="created_desc">Newest</SelectItem>
                            <SelectItem value="created_asc">Oldest</SelectItem>
                            <SelectItem value="date_desc">
                                Due Date (Far)
                            </SelectItem>
                            <SelectItem value="date_asc">
                                Due Date (Soon)
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Separator */}
                <div className="bg-border hidden h-6 w-px sm:ml-5 sm:block" />

                {/* Reset */}
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
