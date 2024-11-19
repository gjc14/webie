import 'highlight.js/styles/base16/atelier-dune.min.css'

import { json, LoaderFunctionArgs, SerializeFrom } from '@remix-run/node'
import {
    ClientLoaderFunctionArgs,
    useLoaderData,
    useNavigate,
} from '@remix-run/react'
import { generateHTML } from '@tiptap/html'
import { common, createLowlight } from 'lowlight'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'

import ExtensionKit from '~/components/editor/extensions/extension-kit'
import { userIs } from '~/lib/db/auth.server'
import { getPostBySlug } from '~/lib/db/post.server'
import { FeaturedImage } from './featured-image'
import { hilightInnerHTML } from './highlight-inner-html'
import { PostFooter } from './post-footer'
import { PostMeta } from './post-meta'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    if (!params.postSlug) {
        throw new Response('Post not found', { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const preview = searchParams.get('preview')

    if (preview) {
        await userIs(request, 'ADMIN', '/admin/signin')
    }

    try {
        const { post, prev, next } = await getPostBySlug(params.postSlug)
        if (!post || post.status !== 'PUBLISHED') {
            throw new Response('Post not found', { status: 404 })
        }
        post.content = post.content
            ? generateHTML(JSON.parse(post.content), [...ExtensionKit])
            : '<p>This is an empty post</p>'
        return json({ post, prev, next })
    } catch (error) {
        console.error(error)
        throw new Response('Post not found', { status: 404 })
    }
}

export type SerializedLoader = SerializeFrom<typeof loader>

let cache: Record<string, SerializeFrom<typeof loader> | undefined> = {}
export const clientLoader = async ({
    serverLoader,
    params,
}: ClientLoaderFunctionArgs) => {
    const postSlug = params.postSlug
    if (!postSlug) throw new Response('Post not found', { status: 404 })

    const cachedPost = cache[postSlug]

    if (cache && cachedPost) {
        return cachedPost
    }

    const postData = await serverLoader<typeof loader>()
    cache = { ...cache, [postSlug]: postData }
    return postData
}

clientLoader.hydrate = true

export default function BlogPost() {
    const navigate = useNavigate()
    const { post, prev, next } = useLoaderData<typeof loader>()
    const lowlight = createLowlight(common)
    const languages = lowlight.listLanguages()

    useEffect(() => {
        document.querySelectorAll('pre code').forEach(block => {
            hilightInnerHTML(block, lowlight, languages)
        })
    }, [post])

    return (
        <article className="w-full px-5 pt-32 md:px-0">
            <div className="not-prose">
                <ArrowLeft
                    size={20}
                    className="absolute -mt-9 cursor-pointer not-prose"
                    onClick={() => navigate(-1)}
                />

                <FeaturedImage
                    src={post.featuredImage || 'https://placehold.co/600x400'}
                    alt={post.title + ' image'}
                    description={post.title + ' image'}
                />

                <PostMeta post={post} />
            </div>

            <div
                className="w-full mx-auto"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="not-prose">
                <PostFooter post={post} next={next} prev={prev} />
            </div>
        </article>
    )
}
