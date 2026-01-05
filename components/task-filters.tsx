"use client"

import { CheckCircle2, Circle, Clock } from "lucide-react"
import { Button } from "./ui/button"
import { TaskStatus } from "@/lib/types/task"

interface Props {
    statusFilter: TaskStatus | "all"
    onStatusFilterChange: (status: TaskStatus | "all") => void
}

const filters = [
    { value: "all", label: "All", icon: Circle },
    { value: "todo", label: "To Do", icon: Circle },
    { value: "in_progress", label: "In Progress", icon: Clock },
    { value: "done", label: "Done", icon: CheckCircle2 },
] as const

export const TaskFilters = ({ statusFilter, onStatusFilterChange }: Props) => {
    return (
        <div className="flex flex-wrap items-center gap-2">
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
                        <Icon className="h-4 w-4 sm:mr-1.5" />
                        <span className="hidden sm:inline">{filter.label}</span>
                    </Button>
                )
            })}
        </div>
    )
}
