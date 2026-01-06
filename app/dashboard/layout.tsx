import { Metadata } from "next"

import { Topbar } from "@/components/topbar"

export const metadata: Metadata = {
    title: "Dashboard",
    description:
        "View and manage your tasks via List, Kanban, or Timeline views.",
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-background min-h-screen">
            <Topbar />
            {children}
        </div>
    )
}
