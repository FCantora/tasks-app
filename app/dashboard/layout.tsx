import { Topbar } from "@/components/topbar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      {children}
    </div>
  )
}