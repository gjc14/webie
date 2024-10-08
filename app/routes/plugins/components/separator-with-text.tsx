import { cn } from '~/lib/utils'

/**
 * Input your text as children. To change separator color, use { color: 'your-color' }.
 */
const SeparatorWithText = ({
    children,
    className,
    paddingY = '12px',
}: {
    children: React.ReactNode
    className?: string
    paddingY?: string
}) => {
    return (
        <div
            className={cn('flex items-center', className)}
            style={{ paddingTop: paddingY, paddingBottom: paddingY }}
        >
            <hr className="flex-grow border-current" />
            <span className="px-3 text-xs text-muted-foreground">
                {children}
            </span>
            <hr className="flex-grow border-current" />
        </div>
    )
}

export default SeparatorWithText
