import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from '~/components/ui/sheet'
import { NavContent } from './nav-content'
import { WebieConfig } from '~/lib/webie/get-plugin-configs.server'

export const Nav = ({
    pluginRoutes,
}: {
    pluginRoutes: WebieConfig['adminRoutes']
}) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            {/* Desktop */}
            <NavContent
                pluginRoutes={pluginRoutes}
                className="hidden sm:block"
                isDesktop={true}
            />

            {/* Mobile */}
            <header className="h-fit w-full flex items-center gap-3 px-3 py-2.5 border-b sm:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant={'outline'} size={'icon'}>
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side={'left'}
                        className="w-full p-0 m-0 border-0 sm:hidden"
                    >
                        <SheetTitle></SheetTitle>
                        <SheetDescription></SheetDescription>
                        <NavContent
                            pluginRoutes={pluginRoutes}
                            className="w-full"
                            isDesktop={false}
                            onClick={() => setOpen(!open)}
                        />
                    </SheetContent>
                </Sheet>
            </header>
        </>
    )
}
