import { z } from "zod"

export const createTaskSchema = z
    .object({
        title: z
            .string()
            .min(1, "Title is required")
            .max(100, "Title must be 100 characters or less"),
        description: z.string().optional(),
        status: z.enum(["todo", "in_progress", "done"]),
        due_date: z.string().optional(),
        start_date: z.string().optional(),
        end_date: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.start_date && data.due_date) {
                return new Date(data.start_date) < new Date(data.due_date)
            }
            return true
        },
        {
            message: "Start date must be before due date",
            path: ["start_date"],
        }
    )
    .refine(
        (data) => {
            if (data.start_date && data.end_date) {
                return new Date(data.start_date) < new Date(data.end_date)
            }
            return true
        },
        {
            message: "Start date must be before completion date",
            path: ["start_date"],
        }
    )
    .transform((data) => {
        if (data.status === "done" && !data.end_date) {
            return {
                ...data,
                end_date: new Date().toISOString(),
            }
        }
        return data
    })

export type CreateTaskSchema = z.infer<typeof createTaskSchema>
