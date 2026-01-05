"use client"

import { ListTodo, LogOut, Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./theme-toggle"
import { useUserSession } from "@/hooks/use-user-session"

import { Skeleton } from "./ui/skeleton"

export const Topbar = () => {
    const { userEmail, loading, sessionLoading, logout } = useUserSession()
    return (
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
                        <ListTodo className="text-primary h-5 w-5" />
                    </div>
                    <span className="hidden text-xl font-bold sm:inline">
                        Task Manager
                    </span>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                    {sessionLoading ? (
                        <Skeleton className="mr-2 h-4 w-32" />
                    ) : userEmail ? (
                        <span className="text-muted-foreground mr-2 text-xs sm:text-sm">
                            {userEmail}
                        </span>
                    ) : null}
                    <ThemeToggle />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={logout}
                        className="h-9 px-2 font-medium sm:px-3"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin sm:mr-2" />
                        ) : (
                            <LogOut className="h-4 w-4 sm:mr-2" />
                        )}
                        <span className="hidden sm:inline">
                            {loading ? "Logging out..." : "Logout"}
                        </span>
                    </Button>
                </div>
            </div>
        </header>
    )
}
