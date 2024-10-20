import { useNavigate } from '@remix-run/react'
import { ArrowLeftCircle } from 'lucide-react'
import { ReactNode, useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { cn } from '~/lib/utils'

const AdminSectionWrapper = ({
    children,
    className,
    shouldConfirm,
    promptMessage = 'Are you sure you want to discard changes?',
    promptTitle = 'Discard changes?',
    hideReturnButton = false,
}: {
    children?: ReactNode
    className?: string
    shouldConfirm?: boolean
    promptMessage?: string
    promptTitle?: string
    hideReturnButton?: boolean
}) => {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)

    return (
        <section
            className={cn(
                'relative flex flex-col p-10 mt-2.5 w-full gap-5',
                className
            )}
        >
            {!hideReturnButton && (
                <ArrowLeftCircle
                    size={16}
                    className="absolute top-3.5 cursor-pointer"
                    onClick={() =>
                        shouldConfirm
                            ? setOpen(true)
                            : navigate('..', { relative: 'path' })
                    }
                    aria-label="return to last page"
                />
            )}
            {children}

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{promptTitle}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {promptMessage}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => navigate(-1)}>
                            Discard
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
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
            className={cn(
                'flex flex-nowrap space-x-1.5 sm:space-x-3',
                className
            )}
        >
            {children}
        </div>
    )
}

export { AdminActions, AdminHeader, AdminSectionWrapper, AdminTitle }
