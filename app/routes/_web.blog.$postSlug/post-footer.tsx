import { useNavigate } from '@remix-run/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { SerializedLoader } from './route'

export const PostFooter = ({ post }: { post: SerializedLoader['post'] }) => {
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
			{/* <div className="flex justify-between items-center my-6">
				<Button
					onClick={() => alert('not implemented')}
					variant={'ghost'}
					className="flex items-center gap-1.5"
				>
					<ArrowLeft size={16} />
					last post
				</Button>

				<Button
					onClick={() => alert('not implemented')}
					variant={'ghost'}
					className="flex items-center gap-1.5"
				>
					next post
					<ArrowRight size={16} />
				</Button>
			</div> */}
		</footer>
	)
}
