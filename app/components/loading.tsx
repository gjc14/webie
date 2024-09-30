import { Loader2 } from 'lucide-react'
import { cn } from '~/lib/utils'

export const Loading = ({
    className,
    size = 16,
}: {
    className?: string
    size?: number
}) => {
    return <Loader2 size={size} className={cn('animate-spin', className)} />
}

export const FullScreenLoading = () => {
    return (
        <div className="z-[9999] fixed inset-0 flex justify-center items-center backdrop-blur-md">
            <SymmetrySpinner />
        </div>
    )
}

export const SymmetrySpinner = ({
    className,
    white,
}: {
    className?: string
    white?: boolean
}) => {
    return (
        <div
            className={cn(
                'w-16 h-16 z-50 border-4 border-y-primary border-x-transparent rounded-full animate-spin ease-in-out',
                white && 'border-y-primary-foreground',
                className
            )}
        ></div>
    )
}
