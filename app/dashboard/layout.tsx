import { Topbar } from "@/components/topbar"

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View and manage your tasks via List, Kanban, or Timeline views.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      {children}
    </div>
  )
}