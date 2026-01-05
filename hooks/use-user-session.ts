import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth"

export function useUserSession() {
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            const { data } = await authService.getUser()
            if (data?.user?.email) {
                setUserEmail(data.user.email)
            }
        }
        getUser()
    }, [])

    const logout = async () => {
        setLoading(true)
        await authService.signOut()
        router.push("/login")
    }

    return {
        userEmail,
        loading,
        logout
    }
}
