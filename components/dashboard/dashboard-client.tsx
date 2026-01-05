"use client"

import { DeleteTaskAlert } from "@/components/delete-task-alert"
import { TaskCard } from "@/components/task-card"
import { TaskDialog } from "@/components/task-dialog"
import { TaskControls } from "@/components/task-controls"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { CreateTaskInput, Task } from "@/lib/types/task"
import { Plus } from "lucide-react"
import { useState } from "react"
import { TaskSkeleton } from "@/components/task-skeleton"
import { TaskKanban } from "@/components/task-kanban"
import { TaskTimeline } from "@/components/task-timeline"
import { useTasks } from "@/hooks/use-tasks"

enum DashboardView {
    LIST = "list",
    KANBAN = "kanban",
    TIMELINE = "timeline",
}

interface DashboardClientProps {
    initialTasks: Task[]
}

export function DashboardClient({ initialTasks }: DashboardClientProps) {
    const {
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
    } = useTasks(initialTasks)

    const [view, setView] = useState<DashboardView>(DashboardView.LIST)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)

    const openCreateDialog = () => {
        setSelectedTask(null)
        setDialogOpen(true)
    }

    const openEditDialog = (task: Task) => {
        setSelectedTask(task)
        setDialogOpen(true)
    }

    const openDeleteAlert = (taskId: string) => {
        setTaskToDelete(taskId)
        setDeleteAlertOpen(true)
    }

    const handleSaveTask = async (input: CreateTaskInput) => {
        if (selectedTask) {
            await updateTask(selectedTask.id, input)
        } else {
            await createTask(input)
        }
    }

    const handleDeleteConfirm = async () => {
        if (!taskToDelete) return
        setDeleteLoading(true)
        try {
            await deleteTask(taskToDelete)
            setDeleteAlertOpen(false)
            setTaskToDelete(null)
        } finally {
            setDeleteLoading(false)
        }
    }

    const resetFilters = () => {
        setStatusFilter("all")
        setSearchQuery("")
        setSortBy("created_desc")
    }

    return (
        <main className="bg-background flex min-h-[calc(100vh-4rem)] flex-col">
            <div className="container mx-auto max-w-7xl px-4 py-6 sm:py-8">
                <Tabs
                    value={view}
                    onValueChange={(v) => setView(v as DashboardView)}
                    className="w-full"
                >
                    <div className="mb-6 flex flex-col gap-4 sm:mb-8">
                        <div className="flex flex-row items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-balance sm:text-4xl">
                                    My Tasks
                                </h1>
                                <p className="text-muted-foreground mt-1.5 sm:mt-2">
                                    {filteredTasks.length}{" "}
                                    {filteredTasks.length === 1
                                        ? "task"
                                        : "tasks"}
                                    {statusFilter !== "all" &&
                                        " matching filter"}
                                </p>
                            </div>
                            <Button
                                onClick={openCreateDialog}
                                size="lg"
                                className="h-12 w-12 flex-shrink-0 rounded-full p-0 font-semibold shadow-sm sm:h-11 sm:w-auto sm:rounded-md sm:px-6"
                            >
                                <Plus className="h-6 w-6 sm:mr-2 sm:h-5 sm:w-5" />
                                <span className="hidden sm:inline">
                                    New Task
                                </span>
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

                    <div className="mb-6">
                        <TaskControls
                            statusFilter={statusFilter}
                            onStatusFilterChange={setStatusFilter}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            onReset={resetFilters}
                        />
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <TaskSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-4 py-12 sm:py-16">
                            <div className="bg-muted mb-4 flex h-20 w-20 items-center justify-center rounded-full sm:h-24 sm:w-24">
                                <Plus className="text-muted-foreground h-10 w-10 sm:h-12 sm:w-12" />
                            </div>
                            <h2 className="mb-2 text-center text-xl font-semibold sm:text-2xl">
                                {tasks.length === 0
                                    ? "No tasks yet"
                                    : "No tasks found"}
                            </h2>
                            <p className="text-muted-foreground mb-6 max-w-sm text-center text-sm text-balance sm:text-base">
                                {tasks.length === 0
                                    ? "Get started by creating your first task to stay organized and productive."
                                    : "Try adjusting your filters to see more tasks."}
                            </p>
                            {tasks.length === 0 && (
                                <Button
                                    onClick={openCreateDialog}
                                    size="lg"
                                    className="h-11 px-6 font-semibold"
                                >
                                    <Plus className="mr-2 h-5 w-5" />
                                    Create Your First Task
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <TabsContent
                                value={DashboardView.LIST}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {filteredTasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onEdit={openEditDialog}
                                            onDelete={openDeleteAlert}
                                            onToggleComplete={toggleComplete}
                                        />
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value={DashboardView.KANBAN}>
                                <TaskKanban
                                    tasks={filteredTasks}
                                    onEdit={openEditDialog}
                                    onDelete={openDeleteAlert}
                                    onToggleComplete={toggleComplete}
                                    onUpdateStatus={updateStatus}
                                    statusFilter={statusFilter}
                                />
                            </TabsContent>
                            <TabsContent value={DashboardView.TIMELINE}>
                                <TaskTimeline
                                    tasks={filteredTasks}
                                    onEdit={openEditDialog}
                                    onDelete={openDeleteAlert}
                                    onToggleComplete={toggleComplete}
                                />
                            </TabsContent>
                        </>
                    )}
                </Tabs>
            </div>
            <TaskDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSave={handleSaveTask}
                task={selectedTask}
            />

            <DeleteTaskAlert
                open={deleteAlertOpen}
                onOpenChange={setDeleteAlertOpen}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
            />

            <footer className="mt-auto border-t py-6">
                <div className="container mx-auto flex flex-col items-center justify-center gap-4 text-center">
                    <p className="text-muted-foreground text-sm">
                        Built by{" "}
                        <span className="text-primary font-medium">
                            Fernando
                        </span>
                    </p>
                </div>
            </footer>
        </main>
    )
}
