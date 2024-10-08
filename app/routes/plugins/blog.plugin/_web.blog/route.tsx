import { Outlet } from '@remix-run/react'

import { MainWrapper } from '../../components/wrappers'
import { CTA } from './components/cta'
import { Footer } from './components/footer'
import { Nav } from './components/nav'

export default function Blog() {
    return (
        <>
            <Nav />
            <MainWrapper>
                <Outlet />
                <CTA />
                <Footer />
            </MainWrapper>
        </>
    )
}
