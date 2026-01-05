import { createClient } from "@/lib/supabase/client"
import type { CreateTaskInput } from "@/lib/types/task"

export const taskService = {
    async getTasks() {
        const supabase = createClient()
        const result = await supabase.from("tasks").select("*").order("created_at", { ascending: false })

        return { data: result.data || [], error: result.error }
    },

    async createTask(input: CreateTaskInput) {
        const supabase = createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return { data: null, error: { message: "Not authenticated" } }
        }

        const result = await supabase
            .from("tasks")
            .insert({
                ...input,
                user_id: user.id,
            })
            .select()
            .single()

        return { data: result.data, error: result.error }
    },

    async updateTask(id: string, input: Partial<CreateTaskInput> & { is_completed?: boolean }) {
        const supabase = createClient()
        const result = await supabase.from("tasks").update(input).eq("id", id).select().single()

        return { data: result.data, error: result.error }
    },

    async deleteTask(id: string) {
        const supabase = createClient()
        const result = await supabase.from("tasks").delete().eq("id", id)

        return { error: result.error }
    },
}
