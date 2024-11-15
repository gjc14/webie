import { cn } from '~/lib/utils'

export const LoaderHR = ({ className }: { className?: string }) => {
    return (
        <hr
            className={cn(
                'h-3.5 border-none rounded bg-gradient-to-r from-cyan-300 via-violet-600 to-sky-500 animate-pulse',
                className
            )}
        />
    )
}
