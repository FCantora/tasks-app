import { createClient } from "@/lib/supabase/server"
import { Suspense } from "react"

async function TasksData() {
    const supabase = await createClient()
    const { data: tasks } = await supabase.from("tasks").select()

    console.log(tasks)

    return <pre>{JSON.stringify(tasks, null, 2)}</pre>
}

export default function Tasks() {
    return (
        <Suspense fallback={<div>Loading tasks...</div>}>
            <TasksData />
        </Suspense>
    )
}
