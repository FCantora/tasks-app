"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth"

export function useAuthForm() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [status, setStatus] = useState({
        loading: false,
        error: null as string | null,
        success: null as string | null
    })
    const router = useRouter()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus({ loading: true, error: null, success: null })

        try {
            if (isSignUp) {
                const { data, error } = await authService.signUp(formData.email, formData.password)

                if (error) throw error

                if (data?.needsConfirmation) {
                    setStatus({
                        loading: false,
                        error: null,
                        success: "Check your email to confirm your account!"
                    })
                } else {
                    router.push("/dashboard")
                    router.refresh()
                }
            } else {
                const { error } = await authService.signIn(formData.email, formData.password)

                if (error) throw error

                router.push("/dashboard")
                router.refresh()
            }
        } catch (err) {
            setStatus({
                loading: false,
                error: err instanceof Error ? err.message : "An error occurred",
                success: null
            })
        }
    }

    const toggleMode = () => {
        setIsSignUp(!isSignUp)
        setStatus({ loading: false, error: null, success: null })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }))
    }

    return {
        isSignUp,
        formData,
        status,
        handleAuth,
        toggleMode,
        handleChange
    }
}
