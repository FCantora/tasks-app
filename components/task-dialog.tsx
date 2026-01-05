import { useEffect, useState } from "react"
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Input, Label, RadioGroup, RadioGroupItem, Textarea } from "./ui"
import { Task, TaskStatus } from "@/lib/types/task"

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
    const [loading, setLoading] = useState(false)

    useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || "")
      setStatus(task.status)
      setDueDate(task.due_date ? task.due_date.split("T")[0] : "")
    } else {
      setTitle("")
      setDescription("")
      setStatus("todo")
      setDueDate("")
    }
  }, [task, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSave({
        title,
        description: description || undefined,
        status,
        due_date: dueDate || undefined,
      })
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl">{task ? "Edit Task" : "Create New Task"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Enter task title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
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

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <RadioGroup
                            value={status}
                            onValueChange={(value) => setStatus(value as TaskStatus)}
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="todo" id="todo" disabled={loading} />
                                <Label htmlFor="todo" className="font-normal cursor-pointer">
                                    To Do
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="in_progress" id="in_progress" disabled={loading} />
                                <Label htmlFor="in_progress" className="font-normal cursor-pointer">
                                    In Progress
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="done" id="done" disabled={loading} />
                                <Label htmlFor="done" className="font-normal cursor-pointer">
                                    Done
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="due_date">Due Date</Label>
                        <Input
                            id="due_date"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            disabled={loading}
                            className="h-11"
                        />
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                            {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}