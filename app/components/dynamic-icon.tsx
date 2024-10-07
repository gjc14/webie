import { LucideProps } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { lazy, Suspense, useMemo } from 'react'

const fallback = <div style={{ background: '#ddd', width: 0, height: 0 }} />

interface IconProps extends Omit<LucideProps, 'ref'> {
    name: keyof typeof dynamicIconImports
}

export type IconOptions = IconProps['name']

const Icon = ({ name, ...props }: IconProps) => {
    // TODO: Uncaught Error:
    // This Suspense boundary received an update before it finished hydrating.
    // This caused the boundary to switch to client rendering.
    // The usual way to fix this is to wrap the original update in startTransition.
    const LucideIcon = useMemo(() => lazy(dynamicIconImports[name]), [name])

    return (
        <Suspense fallback={fallback}>
            <LucideIcon {...props} />
        </Suspense>
    )
}

export default Icon
