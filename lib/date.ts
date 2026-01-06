export const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return ""
    const d = typeof date === "string" ? new Date(date) : date
    return d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    })
}

export const isOverdue = (dateString: string | null | undefined): boolean => {
    if (!dateString) return false
    return new Date(dateString) < new Date()
}
