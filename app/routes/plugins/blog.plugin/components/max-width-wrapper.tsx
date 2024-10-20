import { ReactNode } from 'react'

import { cn } from '~/lib/utils'

export const SectionWrapper = ({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) => {
    return (
        <section className={cn('w-full max-w-2xl mx-auto px-3', className)}>
            {children}
        </section>
    )
}
