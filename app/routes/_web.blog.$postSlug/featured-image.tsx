export const FeaturedImage = ({
	src,
	alt,
	description,
}: {
	src: string
	alt: string
	description: string
}) => {
	return (
		<div className="w-full flex flex-col mb-12">
			<img src={src || 'https://placehold.co/600x400'} alt={alt} />
			<p className="text-center text-muted-foreground py-1">
				{description}
			</p>
		</div>
	)
}
