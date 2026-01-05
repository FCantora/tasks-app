import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "next-themes"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
    title: {
        default: "Task Manager",
        template: "%s | Task Manager",
    },
    description: "A modern task management app built with Next.js and Supabase",
    keywords: [
        "Next.js",
        "Supabase",
        "Task Management",
        "React",
        "Tailwind CSS",
    ],
    authors: [{ name: "Your Name" }],
    creator: "Your Name",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://tasks-app-fcantora.vercel.app/",
        title: "Task Manager - Organize Your Work",
        description:
            "Manage tasks efficiently with Kanban, Timeline, and List views.",
        siteName: "Task Manager",
    },
    twitter: {
        card: "summary_large_image",
        title: "Task Manager - Organize Your Work",
        description:
            "Manage tasks efficiently with Kanban, Timeline, and List views.",
        creator: "@yourhandle",
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster richColors />
                </ThemeProvider>
            </body>
        </html>
    )
}
