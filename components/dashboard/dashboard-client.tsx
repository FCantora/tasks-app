"use client";

import { DeleteTaskAlert } from "@/components/delete-task-alert";
import { TaskCard } from "@/components/task-card";
import { TaskDialog } from "@/components/task-dialog";
import { TaskControls } from "@/components/task-controls";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { CreateTaskInput, Task } from "@/lib/types/task";
import { Plus } from "lucide-react";
import { useState } from "react";
import { TaskSkeleton } from "@/components/task-skeleton";
import { TaskKanban } from "@/components/task-kanban";
import { TaskTimeline } from "@/components/task-timeline";
import { useTasks } from "@/hooks/use-tasks";

enum DashboardView {
    LIST = "list",
    KANBAN = "kanban",
    TIMELINE = "timeline",
}

interface DashboardClientProps {
    initialTasks: Task[];
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
        updateStatus
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
        <main className="bg-background flex flex-col min-h-[calc(100vh-4rem)]">
            <div className="container max-w-7xl mx-auto px-4 py-6 sm:py-8">
                <Tabs value={view} onValueChange={(v) => setView(v as DashboardView)} className="w-full">
                    <div className="flex flex-col gap-4 mb-6 sm:mb-8">
                        <div className="flex flex-row items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-balance">My Tasks</h1>
                                <p className="text-muted-foreground mt-1.5 sm:mt-2">
                                    {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
                                    {statusFilter !== "all" && " matching filter"}
                                </p>
                            </div>
                            <Button
                                onClick={openCreateDialog}
                                size="lg"
                                className="h-12 w-12 rounded-full p-0 sm:h-11 sm:w-auto sm:rounded-md sm:px-6 font-semibold shadow-sm flex-shrink-0"
                            >
                                <Plus className="h-6 w-6 sm:h-5 sm:w-5 sm:mr-2" />
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <TaskSkeleton key={i} />
                            ))}
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
                            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Plus className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-center">
                                {tasks.length === 0 ? "No tasks yet" : "No tasks found"}
                            </h2>
                            <p className="text-muted-foreground text-center mb-6 max-w-sm text-balance text-sm sm:text-base">
                                {tasks.length === 0
                                    ? "Get started by creating your first task to stay organized and productive."
                                    : "Try adjusting your filters to see more tasks."}
                            </p>
                            {tasks.length === 0 && (
                                <Button onClick={openCreateDialog} size="lg" className="h-11 px-6 font-semibold">
                                    <Plus className="h-5 w-5 mr-2" />
                                    Create Your First Task
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <TabsContent value={DashboardView.LIST} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

            <footer className="py-6 border-t mt-auto">
                <div className="container mx-auto flex flex-col items-center justify-center gap-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        Built by <span className="font-medium text-primary">Fernando</span>
                    </p>
                </div>
            </footer>
        </main>
    );
}
