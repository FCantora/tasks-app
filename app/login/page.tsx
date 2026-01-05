import { AuthCard } from "@/components/auth-card";


import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login",
    description: "Sign in to your account to manage your tasks.",
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
            <AuthCard />
        </div>
    )
}
