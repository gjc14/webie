import 'highlight.js/styles/base16/atelier-dune.min.css'

import { json, LoaderFunctionArgs, SerializeFrom } from '@remix-run/node'
import { useLoaderData, useNavigate } from '@remix-run/react'
import { generateHTML } from '@tiptap/react'
import { common, createLowlight } from 'lowlight'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { extensions } from '~/components/editor/default-tiptap'
import { getPostBySlug } from '~/lib/db/post.server'
import { FeaturedImage } from './featured-image'
import { hilightInnerHTML } from './highlight-inner-html'
import { PostFooter } from './post-footer'
import { PostMeta } from './post-meta'

export const loader = async ({ params }: LoaderFunctionArgs) => {
	if (!params.postSlug) {
		throw new Response('Post not found', { status: 404 })
	}

	try {
		const { post } = await getPostBySlug(params.postSlug)
		if (!post) {
			throw new Response('Post not found', { status: 404 })
		}
		return json({ post })
	} catch (error) {
		console.error(error)
		throw new Response('Post not found', { status: 404 })
	}
}

export type SerializedLoader = SerializeFrom<typeof loader>

export default function BlogPost() {
	const navigate = useNavigate()
	const { post } = useLoaderData<typeof loader>()
	const [html, setHtml] = useState('')
	const lowlight = createLowlight(common)
	const languages = lowlight.listLanguages()

	useEffect(() => {
		setHtml(generateHTML(JSON.parse(post.content || ''), extensions))
	}, [])

	useEffect(() => {
		document.querySelectorAll('pre code').forEach(block => {
			hilightInnerHTML(block, lowlight, languages)
		})
	}, [html])

	return (
		<div className="relative px-8 pt-28 md:px-12 md:pt-32">
			<ArrowLeft size={20} className="absolute -mt-9 cursor-pointer" onClick={() => navigate(-1)} />

			<FeaturedImage
				src={post.featuredImage || 'https://placehold.co/600x400'}
				alt={post.title + ' image'}
				description={post.title + ' image'}
			/>

			<PostMeta post={post} />

			<article dangerouslySetInnerHTML={{ __html: html }} />

			<PostFooter post={post} />
		</div>
	)
}
