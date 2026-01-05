import { useEffect, useState } from "react"
import {
    Button,
    Calendar,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Input,
    Label,
    Popover,
    PopoverContent,
    PopoverTrigger,
    RadioGroup,
    RadioGroupItem,
    Textarea,
} from "./ui"
import { Task, TaskStatus } from "@/lib/types/task"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
// Added import
import { toast } from "sonner"
import { createTaskSchema } from "@/lib/schemas/task"

export interface CreateTaskInput {
    title: string
    description?: string
    status?: TaskStatus
    due_date?: string
    start_date?: string
    end_date?: string
}

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (data: CreateTaskInput) => Promise<void>
    task?: Task | null
}

export const TaskDialog = ({ open, onOpenChange, onSave, task }: Props) => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [status, setStatus] = useState<TaskStatus>("todo")
    const [dueDate, setDueDate] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (task) {
            setTitle(task.title)
            setDescription(task.description || "")
            setStatus(task.status)
            setDueDate(task.due_date ? task.due_date.split("T")[0] : "")
            setStartDate(task.start_date ? task.start_date.split("T")[0] : "")
            setEndDate(task.end_date ? task.end_date.split("T")[0] : "")
        } else {
            setTitle("")
            setDescription("")
            setStatus("todo")
            setDueDate("")
            setStartDate("")
            setEndDate("")
        }
    }, [task, open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const formData = {
            title,
            description: description || undefined,
            status,
            due_date: dueDate || undefined,
            start_date: startDate || undefined,
            end_date: endDate || undefined,
        }

        const result = createTaskSchema.safeParse(formData)

        if (!result.success) {
            const errorMessage = result.error.issues[0].message
            toast.error("Invalid Date Range", {
                description: errorMessage,
            })
            setLoading(false)
            return
        }

        try {
            await onSave({
                title,
                description: description || undefined,
                status,
                due_date: dueDate || undefined,
                start_date: startDate || undefined,
                end_date: endDate || undefined,
            })
            onOpenChange(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl">
                        {task ? "Edit Task" : "Create New Task"}
                    </DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-5"
                >
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Enter task title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            maxLength={100}
                            disabled={loading}
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Add more details about this task..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={loading}
                            rows={4}
                            className="resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Planning</Label>
                            <div className="space-y-4 rounded-lg border p-3">
                                <div className="flex flex-col space-y-2">
                                    <Label className="text-muted-foreground text-xs">
                                        Estimated Start
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !startDate &&
                                                        "text-muted-foreground"
                                                )}
                                                disabled={loading}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {startDate ? (
                                                    format(
                                                        new Date(startDate),
                                                        "PPP"
                                                    )
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={
                                                    startDate
                                                        ? new Date(startDate)
                                                        : undefined
                                                }
                                                onSelect={(date) =>
                                                    setStartDate(
                                                        date
                                                            ? date.toISOString()
                                                            : ""
                                                    )
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <Label className="text-muted-foreground text-xs">
                                        Due Date
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !dueDate &&
                                                        "text-muted-foreground"
                                                )}
                                                disabled={loading}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {dueDate ? (
                                                    format(
                                                        new Date(dueDate),
                                                        "PPP"
                                                    )
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={
                                                    dueDate
                                                        ? new Date(dueDate)
                                                        : undefined
                                                }
                                                onSelect={(date) =>
                                                    setDueDate(
                                                        date
                                                            ? date.toISOString()
                                                            : ""
                                                    )
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Status & Actuals</Label>
                            <div className="h-full space-y-4 rounded-lg border p-3">
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground text-xs">
                                        Current Status
                                    </Label>
                                    <RadioGroup
                                        value={status}
                                        onValueChange={(value) =>
                                            setStatus(value as TaskStatus)
                                        }
                                        className="flex flex-col space-y-1"
                                        disabled={loading}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="todo"
                                                id="todo"
                                            />
                                            <Label htmlFor="todo">To Do</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="in_progress"
                                                id="in_progress"
                                            />
                                            <Label htmlFor="in_progress">
                                                In Progress
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value="done"
                                                id="done"
                                            />
                                            <Label htmlFor="done">Done</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {(status === "done" || task) && (
                                    <div className="mt-2 flex flex-col space-y-2 border-t pt-2">
                                        <Label className="text-muted-foreground text-xs">
                                            Actual Completion
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !endDate &&
                                                            "text-muted-foreground"
                                                    )}
                                                    disabled={loading}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {endDate ? (
                                                        format(
                                                            new Date(endDate),
                                                            "PPP"
                                                        )
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={
                                                        endDate
                                                            ? new Date(endDate)
                                                            : undefined
                                                    }
                                                    onSelect={(date) =>
                                                        setEndDate(
                                                            date
                                                                ? date.toISOString()
                                                                : ""
                                                        )
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex-col gap-2 pt-6 sm:flex-row">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto"
                        >
                            {loading
                                ? "Saving..."
                                : task
                                  ? "Update Task"
                                  : "Create Task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
