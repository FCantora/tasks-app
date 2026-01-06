import { useRouter } from "next/navigation"
import { useEffect,useState } from "react"

import { authService } from "@/services/auth"

export const useUserSession = () => {
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [sessionLoading, setSessionLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data } = await authService.getUser()
                if (data?.user?.email) {
                    setUserEmail(data.user.email)
                }
            } finally {
                setSessionLoading(false)
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
        sessionLoading,
        logout,
    }
}
