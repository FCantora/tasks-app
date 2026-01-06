"use client"
import { useState } from "react"

import { DashboardHeader, DashboardView } from "@/components/dashboard/dashboard-header"
import { DeleteTaskAlert } from "@/components/delete-task-alert"
import { EmptyState } from "@/components/empty-state"
import { TaskCard } from "@/components/task-card"
import { TaskControls } from "@/components/task-controls"
import { TaskDialog } from "@/components/task-dialog"
import { TaskKanban } from "@/components/task-kanban"
import { TaskSkeleton } from "@/components/task-skeleton"
import { TaskTimeline } from "@/components/task-timeline"
import { Tabs, TabsContent } from "@/components/ui"
import { useTaskDialogs } from "@/hooks/use-task-dialogs"
import { useTasks } from "@/hooks/use-tasks"
import type { CreateTaskInput, Task } from "@/lib/types/task"
import { DEFAULT_SORT,DEFAULT_STATUS_FILTER } from "@/lib/types/task"

interface Props {
    initialTasks: Task[]
}

export function DashboardClient({ initialTasks }: Props) {
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

    const {
        dialogOpen,
        setDialogOpen,
        selectedTask,
        taskToDelete,
        deleteAlertOpen,
        setDeleteAlertOpen,
        deleteLoading,
        setDeleteLoading,
        openCreateDialog,
        openEditDialog,
        openDeleteAlert,
        closeDeleteAlert,
    } = useTaskDialogs()

    const [view, setView] = useState<DashboardView>(DashboardView.LIST)

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
            closeDeleteAlert()
        } finally {
            setDeleteLoading(false)
        }
    }

    const resetFilters = () => {
        setStatusFilter(DEFAULT_STATUS_FILTER)
        setSearchQuery("")
        setSortBy(DEFAULT_SORT)
    }

    return (
        <main className="bg-background flex min-h-[calc(100vh-4rem)] flex-col">
            <div className="container mx-auto max-w-7xl px-4 py-6 sm:py-8">
                <Tabs
                    value={view}
                    onValueChange={(v) => setView(v as DashboardView)}
                    className="w-full"
                >
                    <DashboardHeader
                        filteredCount={filteredTasks.length}
                        isFiltered={statusFilter !== DEFAULT_STATUS_FILTER}
                        onCreateClick={openCreateDialog}
                    />

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
                            {[1, 2, 3].map((i) => (
                                <TaskSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <EmptyState
                            hasTasks={tasks.length > 0}
                            onCreate={openCreateDialog}
                        />
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
