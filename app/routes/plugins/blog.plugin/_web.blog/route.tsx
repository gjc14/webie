import { Outlet } from '@remix-run/react'

import { Footer } from './components/footer'
import { Nav } from './components/nav'
import { CTA } from './components/cta'

export default function Blog() {
    return (
        <>
            <Nav />
            <main className="w-full h-full min-h-screen flex flex-col items-center">
                <Outlet />
                <CTA />
                <Footer />
            </main>
        </>
    )
}
