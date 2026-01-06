import { useEffect,useState } from "react"
import { toast } from "sonner"

import { TASK_STATUS_VALUES } from "@/lib/constants/tasks"
import { createTaskSchema } from "@/lib/schemas/task"
import {
    CreateTaskInput,
    Task,
} from "@/lib/types/task"

interface Props {
    task?: Task | null
    open: boolean
    onSave: (data: CreateTaskInput) => Promise<void>
    onOpenChange: (open: boolean) => void
}

const DEFAULT_FORM_STATE: CreateTaskInput = {
    title: "",
    description: "",
    status: TASK_STATUS_VALUES.TODO,
    due_date: undefined,
    start_date: undefined,
    end_date: undefined,
}

export const useTaskForm = ({
    task,
    open,
    onSave,
    onOpenChange,
}: Props) => {
    const [formData, setFormData] = useState<CreateTaskInput>(DEFAULT_FORM_STATE)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open) {
            if (task) {
                setFormData({
                    title: task.title,
                    description: task.description || "",
                    status: task.status,
                    due_date: task.due_date ? task.due_date.split("T")[0] : undefined,
                    start_date: task.start_date
                        ? task.start_date.split("T")[0]
                        : undefined,
                    end_date: task.end_date ? task.end_date.split("T")[0] : undefined,
                })
            } else {
                setFormData(DEFAULT_FORM_STATE)
            }
        }
    }, [task, open])

    const updateField = <K extends keyof CreateTaskInput>(
        field: K,
        value: CreateTaskInput[K]
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const result = createTaskSchema.safeParse(formData)

        if (!result.success) {
            const errorMessage = result.error.issues[0].message
            toast.error("Validation Error", {
                description: errorMessage,
            })
            setLoading(false)
            return
        }

        try {
            await onSave(formData)
            onOpenChange(false)
        } finally {
            setLoading(false)
        }
    }

    return {
        formData,
        loading,
        updateField,
        handleSubmit,
    }
}
