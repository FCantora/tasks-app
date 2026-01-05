"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, ListTodo } from "lucide-react"
import { authService } from "../api/auth"

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const router = useRouter()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            if (isSignUp) {
                const { data, error } = await authService.signUp(email, password)

                if (error) throw error

                if (data?.needsConfirmation) {
                    setSuccess("Check your email to confirm your account!")
                } else {
                    router.push("/dashboard")
                    router.refresh()
                }
            } else {
                const { error } = await authService.signIn(email, password)

                if (error) throw error

                router.push("/dashboard")
                router.refresh()
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-2 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                            <ListTodo className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold text-balance">Task Manager</CardTitle>
                    <CardDescription className="text-balance">
                        {isSignUp ? "Create your account to get started" : "Sign in to manage your tasks"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                minLength={6}
                                className="h-11"
                            />
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {success && (
                            <Alert className="border-primary bg-primary/5">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                <AlertDescription className="text-primary">{success}</AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
                            {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
                        </Button>

                        <div className="text-center text-sm">
                            <button
                                type="button"
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-primary hover:underline font-medium"
                                disabled={loading}
                            >
                                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
