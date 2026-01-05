import { Task } from "@/lib/types/task"
import { useMemo } from "react"

export interface TimelineTask extends Task {
    effectiveStart: Date
    effectiveEnd: Date
}

export const useTimelineCalculations = (tasks: Task[]) => {
    // 1. Prepare data with effective dates
    const timelineTasks = useMemo(() => {
        return tasks.map(t => {
            const start = t.start_date ? new Date(t.start_date) : new Date(t.created_at)
            // End date priority: end_date -> due_date -> start (same day task)
            let end = t.end_date ? new Date(t.end_date) : (t.due_date ? new Date(t.due_date) : new Date(start))

            // Ensure end is not before start
            if (end < start) end = start

            return {
                ...t,
                effectiveStart: start,
                effectiveEnd: end,
            }
        })
    }, [tasks])

    // 2. Determine Timeline Range
    const range = useMemo(() => {
        if (timelineTasks.length === 0) return { start: new Date(), end: new Date(), totalDays: 1 }

        const minDate = new Date(Math.min(...timelineTasks.map(t => t.effectiveStart.getTime())))
        const maxDate = new Date(Math.max(...timelineTasks.map(t => t.effectiveEnd.getTime())))

        // Add buffer (1 day before, 5 days after)
        minDate.setDate(minDate.getDate() - 1)
        maxDate.setDate(maxDate.getDate() + 5)

        // Ensure at least a week view if tasks are close
        if (maxDate.getTime() <= minDate.getTime()) {
            maxDate.setDate(minDate.getDate() + 7)
        }

        const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))

        return { start: minDate, end: maxDate, totalDays }
    }, [timelineTasks])


    // Helper to position bars
    const getPosition = (start: Date, end: Date) => {
        const startDiff = Math.ceil((start.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24))
        // Add 1 day (in ms) to include the end date fully: (End - Start) + 1 Day
        const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1 || 1

        const left = (startDiff / range.totalDays) * 100
        const width = (duration / range.totalDays) * 100

        return { left: `${left}%`, width: `${width}%` }
    }

    // Generate date headers
    const headers = useMemo(() => {
        const days = []
        const current = new Date(range.start)
        for (let i = 0; i < range.totalDays; i++) {
            days.push(new Date(current))
            current.setDate(current.getDate() + 1)
        }
        return days
    }, [range])

    // Group headers by month
    const months = useMemo(() => {
        const groups: { label: string; count: number }[] = []
        if (headers.length === 0) return groups

        let currentLabel = headers[0].toLocaleString('en-US', { month: 'long', year: 'numeric' })
        let currentCount = 0

        headers.forEach(date => {
            const label = date.toLocaleString('en-US', { month: 'long', year: 'numeric' })
            if (label !== currentLabel) {
                groups.push({ label: currentLabel, count: currentCount })
                currentLabel = label
                currentCount = 1
            } else {
                currentCount++
            }
        })
        groups.push({ label: currentLabel, count: currentCount })
        return groups
    }, [headers])

    return {
        timelineTasks,
        range,
        headers,
        months,
        getPosition
    }
}
