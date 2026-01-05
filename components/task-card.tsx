import { Calendar, CheckCircle2, Clock, Pencil, Trash2 } from "lucide-react"
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    Checkbox,
} from "./ui"
import { Task } from "@/lib/types/task"
import { cn } from "@/lib/utils"
import { TASK_STATUS_COLORS, TASK_STATUS_LABELS } from "@/lib/constants/tasks"
import { formatDate, isOverdue } from "@/lib/date"

interface Props {
    task: Task
    onEdit: (task: Task) => void
    onDelete: (taskId: string) => void
    onToggleComplete: (taskId: string, isCompleted: boolean) => void
}

export const TaskCard = ({
    task,
    onEdit,
    onDelete,
    onToggleComplete,
}: Props) => {
    return (
        <Card className="group hover:border-primary/30 flex flex-col transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                    <Checkbox
                        checked={task.is_completed}
                        onCheckedChange={(checked) =>
                            onToggleComplete(task.id, checked as boolean)
                        }
                        className="mt-1 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-1.5">
                        <h3
                            className={`text-lg leading-tight font-semibold text-balance break-words ${task.is_completed ? "text-muted-foreground line-through" : ""}`}
                        >
                            {task.title}
                        </h3>
                        <Badge
                            className={TASK_STATUS_COLORS[task.status]}
                            variant="secondary"
                        >
                            {TASK_STATUS_LABELS[task.status]}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            {task.description && (
                <CardContent className="flex-1 pb-3">
                    <p className="text-muted-foreground line-clamp-3 text-sm text-pretty break-words">
                        {task.description}
                    </p>
                </CardContent>
            )}
            <CardFooter className="mt-auto flex items-center justify-between border-t pt-3">
                <TaskDates task={task} />
                <TaskActions task={task} onEdit={onEdit} onDelete={onDelete} />
            </CardFooter>
        </Card>
    )
}

const TaskDates = ({ task }: { task: Task }) => {
    return (
        <div className="text-muted-foreground flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">
                    Start: {formatDate(task.start_date || task.created_at)}
                </span>
            </div>

            {task.status === "done" && task.end_date ? (
                <div className="flex items-center gap-1.5 font-medium text-green-600 dark:text-green-500">
                    <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">
                        Completed: {formatDate(task.end_date)}
                    </span>
                </div>
            ) : (
                task.due_date && (
                    <div
                        className={cn(
                            "flex items-center gap-1.5 font-medium",
                            isOverdue(task.due_date)
                                ? "text-red-600 dark:text-red-500"
                                : "text-amber-600 dark:text-amber-500"
                        )}
                    >
                        <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">
                            {isOverdue(task.due_date) ? "Overdue: " : "Due: "}
                            {formatDate(task.due_date)}
                        </span>
                    </div>
                )
            )}
        </div>
    )
}

const TaskActions = ({
    task,
    onEdit,
    onDelete,
}: {
    task: Task
    onEdit: (task: Task) => void
    onDelete: (taskId: string) => void
}) => {
    return (
        <div className="flex gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
            <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onEdit(task)}
            >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
            </Button>
            <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive h-8 w-8 p-0"
                onClick={() => onDelete(task.id)}
            >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
            </Button>
        </div>
    )
}
