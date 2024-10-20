import {
    json,
    LoaderFunctionArgs,
    SerializeFrom,
    type MetaFunction,
} from '@remix-run/node'
import { ClientLoaderFunctionArgs, useLoaderData } from '@remix-run/react'

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

let cache: SerializeFrom<typeof loader>
export const clientLoader = async ({
    serverLoader,
}: ClientLoaderFunctionArgs) => {
    if (cache) {
        return cache
    }

    cache = await serverLoader()
    return cache
}

clientLoader.hydrate = true

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
