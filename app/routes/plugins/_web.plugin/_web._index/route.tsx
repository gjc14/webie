import { json, LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { getSEO } from '~/lib/db/seo.server'
import { MainWrapper } from '../../components/wrappers'
import { Footer } from '../_web/components/footer'
import { Nav } from '../_web/components/nav'
import { Hero } from './hero'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return data?.seo
        ? [
              { title: data.seo.title },
              { name: 'description', content: data.seo.description },
          ]
        : []
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { seo } = await getSEO(new URL(request.url).pathname)

    try {
        return json({ seo })
    } catch (error) {
        console.error(error)
        return json({ seo })
    }
}

export default function Index() {
    const { seo } = useLoaderData<typeof loader>()

    return (
        <>
            <Nav />

            <MainWrapper>
                <h1 className="visually-hidden">{seo?.title}</h1>
                <Hero />
                <Footer />
            </MainWrapper>
        </>
    )
}
