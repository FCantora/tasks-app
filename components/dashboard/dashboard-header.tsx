import { Plus } from "lucide-react"

import { Button, TabsList, TabsTrigger } from "@/components/ui"

export enum DashboardView {
    LIST = "list",
    KANBAN = "kanban",
    TIMELINE = "timeline",
}

interface Props {
    filteredCount: number
    isFiltered: boolean
    onCreateClick: () => void
}

export const DashboardHeader = ({
    filteredCount,
    isFiltered,
    onCreateClick,
}: Props) => {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:mb-8">
            <div className="flex flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-balance sm:text-4xl">
                        My Tasks
                    </h1>
                    <p className="text-muted-foreground mt-1.5 sm:mt-2">
                        {filteredCount}{" "}
                        {filteredCount === 1 ? "task" : "tasks"}
                        {isFiltered && " matching filter"}
                    </p>
                </div>
                <Button
                    onClick={onCreateClick}
                    size="lg"
                    className="h-12 w-12 flex-shrink-0 rounded-full p-0 font-semibold shadow-sm sm:h-11 sm:w-auto sm:rounded-md sm:px-6"
                >
                    <Plus className="h-6 w-6 sm:mr-2 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">New Task</span>
                </Button>
            </div>

            <div className="flex items-center justify-between border-b pb-px">
                <TabsList>
                    <TabsTrigger value={DashboardView.LIST}>
                        List View
                    </TabsTrigger>
                    <TabsTrigger value={DashboardView.KANBAN}>
                        Kanban Board
                    </TabsTrigger>
                    <TabsTrigger value={DashboardView.TIMELINE}>
                        Timeline View
                    </TabsTrigger>
                </TabsList>
            </div>
        </div>
    )
}
