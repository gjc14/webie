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

export const Nav = () => {
    const [open, setOpen] = useState(false)

    return (
        <>
            {/* Desktop */}
            <NavContent className="hidden sm:block" isDesktop={true} />

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
