import { Editor } from '@tiptap/react'
import { ChevronDown } from 'lucide-react'
import { EditOptionProps } from '~/components/editor/edit-options'
import { Button } from '~/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '~/components/ui/popover'
import { Separator } from '~/components/ui/separator'

type OptionTypes = EditOptionProps | { label: string }

const isLabel = (option: OptionTypes): option is { label: string } => {
	return (option as { label: string }).label !== undefined
}
const isOption = (option: OptionTypes): option is EditOptionProps => {
	return (option as EditOptionProps).icon !== undefined
}

export const PopoverMenuOptions = ({
	activeIcon,
	defaultIcon,
	options,
	editor,
	hideIndicator = false,
}: {
	options: OptionTypes[]
	editor: Editor
	activeIcon?: JSX.Element
	defaultIcon: JSX.Element
	hideIndicator?: boolean
}) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant={'ghost'}
					className={'px-2 py-1 h-7 space-x-1'}
				>
					{activeIcon ? activeIcon : defaultIcon}
					{!hideIndicator && <ChevronDown size={12} />}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-fit max-h-[50vh] flex flex-col p-1 gap-0.5 overflow-scroll"
				sideOffset={8}
			>
				{options.map((option, index) => {
					if (isLabel(option)) {
						return (
							<div className="my-0.5 space-y-0.5">
								<p
									key={index}
									className="text-xs text-muted-foreground font-bold uppercase mx-1"
								>
									{option.label}
								</p>
								<Separator />
							</div>
						)
					} else if (isOption(option)) {
						return (
							<Button
								key={index}
								variant={'ghost'}
								className={`justify-start space-x-2 h-fit py-1 px-2 rounded-sm ${
									option.isActive?.(editor)
										? 'bg-accent text-accent-foreground'
										: ''
								}`}
								onClick={() => option.onClick(editor)}
								disabled={!option.can(editor)}
							>
								{option.icon(14)}
								<span>{option.tooltip}</span>
							</Button>
						)
					}
				})}
			</PopoverContent>
		</Popover>
	)
}
