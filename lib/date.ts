export const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    })
}

export const isOverdue = (dateString: string | null | undefined): boolean => {
    if (!dateString) return false
    return new Date(dateString) < new Date()
}
