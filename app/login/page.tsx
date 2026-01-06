import { Metadata } from "next"

import { AuthCard } from "@/components/auth-card"

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
