import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "./ui"

export const ThemeToggle = () => {
    const { setTheme, resolvedTheme } = useTheme()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="h-9 w-9"
        >
            {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
