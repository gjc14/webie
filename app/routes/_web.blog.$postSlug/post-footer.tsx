import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons'
import { useNavigate } from '@remix-run/react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { SerializedLoader } from './route'

export const PostFooter = ({
	post,
	prev,
	next,
}: {
	post: SerializedLoader['post']
	prev: { title: string; slug: string } | null
	next: { title: string; slug: string } | null
}) => {
	const navigate = useNavigate()

	return (
		<footer className="py-9 md:py-12">
			{/* Tags area */}
			{post.tags.length > 0 && (
				<ul className="flex items-center gap-1.5 my-8 md:my-12 md:gap-2">
					{post.tags.map(tag => (
						<li key={tag.id}>
							<Badge
								className="px-2 py-1 rounded-full md:text-sm cursor-pointer"
								onClick={() => navigate(`/blog/tag?q=${tag.name}`)}
							>
								{tag.name}
							</Badge>
						</li>
					))}
				</ul>
			)}

			<Separator />

			{/* Navigation area */}
			<div className="flex justify-between items-center my-6">
				<Button
					onClick={() => navigate(`/blog/${prev?.slug}`)}
					variant={'link'}
					className="flex items-center gap-1.5"
					disabled={!prev}
				>
					<ArrowLeftIcon />
					{prev ? prev.title : 'previous post'}
				</Button>

				<Button
					onClick={() => navigate(`/blog/${next?.slug}`)}
					variant={'link'}
					className="flex items-center gap-1.5"
					disabled={!next}
				>
					{next ? next.title : 'next post'}
					<ArrowRightIcon />
				</Button>
			</div>
		</footer>
	)
}
