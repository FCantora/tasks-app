import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const TaskSkeleton = () => {
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                    <Skeleton className="mt-1 h-5 w-5 rounded" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-5 w-20" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-1.5 h-4 w-2/3" />
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t pt-3">
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </CardFooter>
        </Card>
    )
}
