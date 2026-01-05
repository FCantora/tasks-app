import { Calendar, Edit2, Trash2 } from "lucide-react"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Checkbox } from "./ui/checkbox"
import { Button } from "./ui/button"
import { Task } from "@/lib/types/task"

interface Props {
    task: Task
    onEdit: (task: Task) => void
    onDelete: (taskId: string) => void
    onToggleComplete: (taskId: string, isCompleted: boolean) => void
}

const statusColors = {
    todo: "bg-muted text-muted-foreground",
    in_progress: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    done: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
}

const statusLabels = {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done",
}

export const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }: Props) => {
    return (
        <Card className="group hover:shadow-md transition-all duration-200 hover:border-primary/30 flex flex-col">
            <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                    <Checkbox
                        checked={task.is_completed}
                        onCheckedChange={(checked) => onToggleComplete(task.id, checked as boolean)}
                        className="mt-1 flex-shrink-0"
                    />
                    <div className="flex-1 space-y-1.5 min-w-0">
                        <h3
                            className={`font-semibold text-lg leading-tight text-balance break-words ${task.is_completed ? "line-through text-muted-foreground" : ""}`}
                        >
                            {task.title}
                        </h3>
                        <Badge className={statusColors[task.status]} variant="secondary">
                            {statusLabels[task.status]}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            {task.description && (
                <CardContent className="pb-3 flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3 text-pretty break-words">{task.description}</p>
                </CardContent>
            )}
            <CardFooter className="flex items-center justify-between pt-3 border-t mt-auto">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">
                        {new Date(task.created_at).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
                </div>
                <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEdit(task)}>
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Edit task</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => onDelete(task.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete task</span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}