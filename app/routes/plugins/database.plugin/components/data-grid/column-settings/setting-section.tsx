import { ReactNode } from 'react'
import { cn } from '~/lib/utils'

export const SettingSectionWrapper = (props: {
    title: string
    description?: string
    children?: ReactNode
    className?: string
    titleClassName?: string
}) => {
    return (
        <div className="my-3">
            <div className="mb-2">
                <h3
                    className={cn(
                        'text-base font-semibold md:text-lg',
                        props.titleClassName
                    )}
                >
                    {props.title}
                </h3>
                {props.description && (
                    <p className="text-xs text-muted-foreground md:text-sm">
                        {props.description}
                    </p>
                )}
            </div>

            {props.children}
        </div>
    )
}
