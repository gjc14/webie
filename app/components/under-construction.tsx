export const UnderConstruction = ({
	nav,
	footer,
}: {
	nav?: React.ReactNode
	footer?: React.ReactNode
}) => {
	return (
		<>
			{nav}
			<main className="w-full h-full min-h-screen flex flex-col">
				<div className="flex flex-col items-center justify-center grow">
					<img
						src="/placeholders/20101.svg"
						alt="busy working with the page"
						className="mb-4"
					/>
					<h3>Under construction</h3>
				</div>
				{footer}
			</main>
		</>
	)
}
