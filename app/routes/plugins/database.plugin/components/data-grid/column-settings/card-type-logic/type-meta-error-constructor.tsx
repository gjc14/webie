import { Separator } from '~/components/ui/separator'
import { cn } from '~/lib/utils'

interface WebieTypeSettingErrorConstructorProps {
    title?: string
    message?: string
    className?: string
}

export const WebieTypeSettingErrorConstructor = ({
    title = 'System error',
    message = 'Cannot get data of this type. Please select again.',
    className,
}: WebieTypeSettingErrorConstructorProps) => {
    return (
        <div
            className={cn(
                'px-1.5 py-1 bg-destructive rounded-md text-sm',
                className
            )}
        >
            <p className="px-1.5 py-0.5 bg-destructive rounded-md text-base font-semibold">
                {title}:
            </p>
            <p className="px-1.5 py-0.5 bg-destructive rounded-md text-sm">
                {message}
            </p>
            <Separator className="mt-3.5 mb-1.5 bg-primary" />
            <p className="px-1.5 py-0.5 bg-destructive rounded-md text-sm">
                Find support at{' '}
                <a
                    href="https://webie.io"
                    className="underline"
                    aria-label="Go to webie website"
                >
                    webie.io
                </a>
                .
            </p>
        </div>
    )
}
