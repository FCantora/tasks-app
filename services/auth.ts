import { createClient } from "@/lib/supabase/client"

export const authService = {
    async signIn(email: string, password: string) {
        const supabase = createClient()
        const result = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        return {
            data: result.data.session ? { user: result.data.user } : null,
            error: result.error,
        }
    },

    async signUp(email: string, password: string) {
        const supabase = createClient()
        const result = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo:
                    process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
                    `${window.location.origin}/dashboard`,
            },
        })

        return {
            data: {
                user: result.data.user,
                needsConfirmation:
                    result.data.user && !result.data.user.confirmed_at,
            },
            error: result.error,
        }
    },

    async signOut() {
        const supabase = createClient()
        return await supabase.auth.signOut()
    },

    async getUser() {
        const supabase = createClient()
        return await supabase.auth.getUser()
    },
}
