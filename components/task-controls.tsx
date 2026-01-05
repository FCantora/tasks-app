"use client";

import { CheckCircle2, Circle, Clock, Search } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { TaskStatus } from "@/lib/types/task"

export type SortOption = "date_desc" | "date_asc" | "created_desc" | "created_asc"



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
    hideSort?: boolean
    hideStatusFilter?: boolean
}

export const TaskControls = ({
    statusFilter,
    onStatusFilterChange,
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    hideSort = false,
    hideStatusFilter = false,
}: Props) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
            {!hideStatusFilter ? (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground mr-1 hidden sm:inline">Filter:</span>
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
                                <Icon className="h-4 w-4 mr-1.5" />
                                <span>{filter.label}</span>
                            </Button>
                        )
                    })}
                </div>
            ) : (
                /* Spacer to keep Search aligned to the right if needed, or just let justify-between handle it */
                /* If we want Search on the left when filters are hidden, we don't need this.
                   But if we want Search to fill space or be on the left, simply omitting the div is enough for justify-between with 2 items.
                   However, if we want strict "Search ... Sort", removing this div leaves 2 items: Search and Sort.
                   justify-between will put Search at start, Sort at end. This matches "justificado between".
                */
                null
            )}
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-9 h-9"
                />
            </div>
            {!hideSort && (
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Sort by:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value as SortOption)}
                        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        <option value="created_desc">Newest First</option>
                        <option value="created_asc">Oldest First</option>
                        <option value="date_desc">Due Date (Far)</option>
                        <option value="date_asc">Due Date (Soon)</option>
                    </select>
                </div>
            )}
        </div>
    )
}
