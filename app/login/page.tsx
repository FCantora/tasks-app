import { AuthCard } from "@/components/auth-card"

import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Login",
    description: "Sign in to your account to manage your tasks.",
}

export default function LoginPage() {
    return (
        <div className="from-background via-background to-accent/5 flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
            <AuthCard />
        </div>
    )
}
