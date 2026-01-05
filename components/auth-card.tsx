"use client"

import { Alert, AlertDescription, Button, Input, Label, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui"
import { CheckCircle2, ListTodo } from "lucide-react"
import { useAuthForm } from "@/hooks/use-auth-form"

export const AuthCard = () => {
    const {
        isSignUp,
        formData,
        status,
        handleAuth,
        toggleMode,
        handleChange
    } = useAuthForm()

    return (
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
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={status.loading}
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={status.loading}
                            minLength={6}
                            className="h-11"
                        />
                    </div>

                    {status.error && (
                        <Alert variant="destructive">
                            <AlertDescription>{status.error}</AlertDescription>
                        </Alert>
                    )}

                    {status.success && (
                        <Alert className="border-primary bg-primary/5">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <AlertDescription className="text-primary">{status.success}</AlertDescription>
                        </Alert>
                    )}

                    <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={status.loading}>
                        {status.loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
                    </Button>

                    <div className="text-center text-sm">
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="text-primary hover:underline font-medium"
                            disabled={status.loading}
                        >
                            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                        </button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
