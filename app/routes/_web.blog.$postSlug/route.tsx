import 'highlight.js/styles/base16/atelier-dune.min.css'

import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { generateHTML } from '@tiptap/react'
import { common, createLowlight } from 'lowlight'
import { useEffect, useState } from 'react'
import { extensions } from '~/components/editor/default-tiptap'
import { getPostBySlug } from '~/lib/db/post.server'
import { hilightInnerHTML } from './highlight-inner-html'

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

export default function BlogPost() {
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
		<div className="px-8 pt-28 md:px-12 md:pt-32">
			<div className="w-full flex flex-col mb-12">
				<img src={post.featuredImage || 'https://placehold.co/600x400'} alt={post.title + ' image'} />
				<p className="text-center text-muted-foreground py-1">{post.title + ' image'}</p>
			</div>

			<h1>{post.title}</h1>

			<div className="flex flex-col gap-5 mt-5 mb-16 md:mt-6 md:mb-20">
				<p className="prose text-sm text-muted-foreground md:text-base">{post.excerpt}</p>
				<div className="w-full h-fit flex justify-between items-center px-1.5 border-y">
					<div className="flex gap-2 items-center my-1.5 md:my-2">
						<img
							src={post.author.imageUri || '/placeholders/avatar.png'}
							alt={'Author avatar'}
							className="w-9 h-9 rounded-full"
						/>
						<p>{post.author.name}</p>
					</div>
					<p className="text-xs md:text-sm">{new Date(post.updatedAt).toLocaleString('zh-TW')}</p>
				</div>
			</div>

			<article dangerouslySetInnerHTML={{ __html: html }} />
		</div>
	)
}
