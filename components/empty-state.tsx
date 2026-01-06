import { Plus } from "lucide-react"

import { Button } from "./ui"

interface Props {
    hasTasks: boolean
    onCreate: () => void
}

export const EmptyState = ({ hasTasks, onCreate }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center px-4 py-12 sm:py-16">
            <div className="bg-muted mb-4 flex h-20 w-20 items-center justify-center rounded-full sm:h-24 sm:w-24">
                <Plus className="text-muted-foreground h-10 w-10 sm:h-12 sm:w-12" />
            </div>
            <h2 className="mb-2 text-center text-xl font-semibold sm:text-2xl">
                {!hasTasks ? "No tasks yet" : "No tasks found"}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-sm text-center text-sm text-balance sm:text-base">
                {!hasTasks
                    ? "Get started by creating your first task to stay organized and productive."
                    : "Try adjusting your filters to see more tasks."}
            </p>
            {!hasTasks && (
                <Button
                    onClick={onCreate}
                    size="lg"
                    className="h-11 px-6 font-semibold"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Create Your First Task
                </Button>
            )}
        </div>
    )
}
