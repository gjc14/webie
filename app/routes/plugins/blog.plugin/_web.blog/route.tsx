import { Outlet } from '@remix-run/react'

import { MainWrapper } from '~/components/wrappers'
import { Footer } from '../../_web.plugin/_web/components/footer'
import { Nav } from '../../_web.plugin/_web/components/nav'
import { CTA } from '../components/cta'

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
