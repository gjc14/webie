import { ReactNode } from 'react'
import { cn } from '~/lib/utils'

const AdminSectionWrapper = ({
    children,
    className,
}: {
    children?: ReactNode
    className?: string
}) => {
    return (
        <section
            className={cn(
                'relative flex flex-col p-3 w-full gap-5 md:p-6',
                className
            )}
        >
            {children}
        </section>
    )
}

const AdminHeader = ({
    children,
    className,
}: {
    children?: ReactNode
    className?: string
}) => {
    return (
        <div
            className={cn(
                'flex justify-between items-center flex-wrap-reverse gap-3',
                className
            )}
        >
            <>{children}</>
        </div>
    )
}

const AdminTitle = ({
    children,
    className,
    description,
    descriptionClassName,
}: {
    children?: ReactNode
    className?: string
    description?: string
    descriptionClassName?: string
}) => {
    if (description) {
        return (
            <div className="space-y-2">
                <h2 className={className}>{children}</h2>
                <p
                    className={cn(
                        'text-sm text-muted-foreground',
                        descriptionClassName
                    )}
                >
                    {description}
                </p>
            </div>
        )
    }
    return <h2 className={className}>{children}</h2>
}

const AdminActions = ({
    children,
    className,
}: {
    children?: ReactNode
    className?: string
}) => {
    return (
        <div
            className={cn('flex flex-nowrap items-center space-x-2', className)}
        >
            {children}
        </div>
    )
}

export { AdminActions, AdminHeader, AdminSectionWrapper, AdminTitle }
