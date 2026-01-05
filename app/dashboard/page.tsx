import { createClient } from "@/lib/supabase/server"
import { DashboardClient } from "@/components/dashboard"

export default async function DashboardPage() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // We already check for user in middleware, but for TS safety
    if (!user) {
        return null // Middleware handles redirect
    }

    const { data: tasks } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

    return <DashboardClient initialTasks={tasks || []} />
}
