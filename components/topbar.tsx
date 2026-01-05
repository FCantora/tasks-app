"use client";

import { ListTodo, LogOut, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useRouter } from "next/navigation";
import { authService } from "@/app/api/auth";
import { useState } from "react";

export const Topbar = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const logout = async () => {
        setLoading(true)
        await authService.signOut()
        router.push("/login")
    }
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ListTodo className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-bold text-xl hidden sm:inline">Task Manager</span>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                    <ThemeToggle />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={logout}
                        className="h-9 px-2 sm:px-3 font-medium"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
                        ) : (
                            <LogOut className="h-4 w-4 sm:mr-2" />
                        )}
                        <span className="hidden sm:inline">{loading ? "Logging out..." : "Logout"}</span>
                    </Button>
                </div>
            </div>
        </header>
    );
};
