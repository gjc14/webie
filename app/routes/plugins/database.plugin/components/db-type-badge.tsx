import { ReactNode } from 'react'
import { cn } from '~/lib/utils'

export const DbTypeBadge = ({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) => {
    return (
        <span
            className={cn(
                'px-1.5 py-0.5 bg-secondary text-secondary-foreground shadow border border-border rounded-md',
                className
            )}
        >
            {children}
        </span>
    )
}
