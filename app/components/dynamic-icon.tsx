import { Loader, LucideProps } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { lazy, Suspense, useMemo } from 'react'
import { cn } from '~/lib/utils'

interface IconProps extends Omit<LucideProps, 'ref'> {
    name: keyof typeof dynamicIconImports
}

export type IconOptions = IconProps['name']

const Icon = ({ name, className, ...props }: IconProps) => {
    // TODO: Uncaught Error:
    // This Suspense boundary received an update before it finished hydrating.
    // This caused the boundary to switch to client rendering.
    // The usual way to fix this is to wrap the original update in startTransition.
    // This appears when using icon in radix trigger
    const LucideIcon = useMemo(() => lazy(dynamicIconImports[name]), [name])
    const fallback = useMemo(
        () => (
            <Loader
                className={cn(
                    'bg-gradient-to-t from-inherit size-3.5 animate-spin-slow',
                    className
                )}
                {...props}
            />
        ),
        [className, props]
    )

    return (
        <Suspense fallback={fallback}>
            <LucideIcon className={className} {...props} />
        </Suspense>
    )
}

export default Icon
