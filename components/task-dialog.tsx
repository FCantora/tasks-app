import { Calendar as CalendarIcon } from "lucide-react"

import { useTaskForm } from "@/hooks/use-task-form"
import { TASK_STATUS_VALUES } from "@/lib/constants/tasks"
import { formatDate } from "@/lib/date"
import { CreateTaskInput, Task, TaskStatus } from "@/lib/types/task"
import { cn } from "@/lib/utils"

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

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (data: CreateTaskInput) => Promise<void>
    task?: Task | null
}

export const TaskDialog = (props: Props) => {
    const { formData, loading, updateField, handleSubmit } = useTaskForm(props)
    const { task, open, onOpenChange } = props

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
                            value={formData.title}
                            onChange={(e) => updateField("title", e.target.value)}
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
                            value={formData.description || ""}
                            onChange={(e) =>
                                updateField("description", e.target.value)
                            }
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
                                                    !formData.start_date &&
                                                    "text-muted-foreground"
                                                )}
                                                disabled={loading}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {formData.start_date ? (
                                                    formatDate(formData.start_date)
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
                                                    formData.start_date
                                                        ? new Date(formData.start_date)
                                                        : undefined
                                                }
                                                onSelect={(date) =>
                                                    updateField("start_date",
                                                        date ? date.toISOString() : undefined
                                                    )
                                                }
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
                                                    !formData.due_date &&
                                                    "text-muted-foreground"
                                                )}
                                                disabled={loading}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {formData.due_date ? (
                                                    formatDate(formData.due_date)
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
                                                    formData.due_date
                                                        ? new Date(formData.due_date)
                                                        : undefined
                                                }
                                                onSelect={(date) =>
                                                    updateField("due_date",
                                                        date ? date.toISOString() : undefined
                                                    )
                                                }
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
                                        value={formData.status}
                                        onValueChange={(value) =>
                                            updateField("status", value as TaskStatus)
                                        }
                                        className="flex flex-col space-y-1"
                                        disabled={loading}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value={TASK_STATUS_VALUES.TODO}
                                                id="todo"
                                            />
                                            <Label htmlFor="todo">To Do</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value={TASK_STATUS_VALUES.IN_PROGRESS}
                                                id="in_progress"
                                            />
                                            <Label htmlFor="in_progress">
                                                In Progress
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value={TASK_STATUS_VALUES.DONE}
                                                id="done"
                                            />
                                            <Label htmlFor="done">Done</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {(formData.status === TASK_STATUS_VALUES.DONE || task) && (
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
                                                        !formData.end_date &&
                                                        "text-muted-foreground"
                                                    )}
                                                    disabled={loading}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {formData.end_date ? (
                                                        formatDate(formData.end_date)
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
                                                        formData.end_date
                                                            ? new Date(formData.end_date)
                                                            : undefined
                                                    }
                                                    onSelect={(date) =>
                                                        updateField("end_date",
                                                            date ? date.toISOString() : undefined
                                                        )
                                                    }
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
        </Dialog >
    )
}
