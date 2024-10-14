import { ReactNode } from 'react'
import { cn } from '~/lib/utils'

export const SettingSectionWrapper = (props: {
    title: string
    description?: string | ReactNode
    children?: ReactNode
    className?: string
    titleClassName?: string
}) => {
    const { title, description, children, className, titleClassName } = props

    return (
        <div className={cn('my-3', className)}>
            <div className="mb-2">
                <h3
                    className={cn(
                        'text-base font-semibold md:text-lg',
                        titleClassName
                    )}
                >
                    {title}
                </h3>
                {description && (
                    <p className="text-xs text-muted-foreground md:text-sm">
                        {description}
                    </p>
                )}
            </div>

            {children}
        </div>
    )
}
