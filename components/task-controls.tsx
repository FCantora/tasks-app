"use client";

import { CheckCircle2, Circle, Clock, RotateCcw, Search } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { TaskStatus } from "@/lib/types/task"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

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
    const isFiltered = statusFilter !== "all" || searchQuery !== "" || sortBy !== "created_desc"

    return (
        <div className="px-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap items-center justify-between gap-2 w-full sm:w-auto">
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

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-center flex-1 justify-end">
                {/* Search */}
                <div className="relative w-full sm:max-w-[200px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 h-9"
                    />
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label className="text-sm font-medium text-muted-foreground whitespace-nowrap hidden sm:inline">Sort:</label>
                    <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
                        <SelectTrigger className="w-full sm:w-[150px] h-9">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="created_desc">Newest</SelectItem>
                            <SelectItem value="created_asc">Oldest</SelectItem>
                            <SelectItem value="date_desc">Due Date (Far)</SelectItem>
                            <SelectItem value="date_asc">Due Date (Soon)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Separator */}
                <div className="h-6 w-px bg-border hidden sm:block sm:ml-5" />

                {/* Reset */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onReset}
                    disabled={!isFiltered}
                    className="h-9 w-auto px-2 sm:px-0 sm:w-9 text-muted-foreground hover:text-foreground shrink-0"
                    title="Reset filters"
                >
                    <RotateCcw className={`h-4 w-4 ${isFiltered ? "text-primary hover:text-primary/80" : ""}`} />
                    <span className="ml-2 sm:hidden text-xs">Reset all filters</span>
                </Button>
            </div>
        </div>
    )
}
