import { Editor } from '@tiptap/react'
import { Separator } from '~/components/ui/separator'
import {
	editAlignOptions,
	editHistoryOptions,
	editListOptions,
	editMarkOptions,
	editMiscOptions,
	editParagraphOptions,
} from '../../edit-options'
import { ToggleButton } from '../toggle-button'
import { useCallback, useState } from 'react'
import Youtube from '~/components/editor/components/asset/youtube'
import { Image } from 'lucide-react'

export const MenuBar = ({ editor }: { editor: Editor }) => {
	const [height, setHeight] = useState('480')
	const [width, setWidth] = useState('640')

	return (
		<div id="menu-bar" className="my-3 py-1.5 border-y">
			<div id="buttons" className="flex flex-wrap items-center gap-1 p-1">
				{/* Formatting */}
				{editMarkOptions.map((option, index) => (
					<ToggleButton
						key={index}
						onClick={() => option.onClick(editor)}
						disabled={!option.can(editor)}
						className={
							option.isActive?.(editor)
								? 'bg-accent text-bg-accent-foreground'
								: ''
						}
						shortcut={option.shortcut}
						tooltip={option.tooltip}
					>
						{option.icon(14)}
					</ToggleButton>
				))}

				<Separator
					orientation="vertical"
					className="h-full min-h-[1.5rem]"
				/>

				{/* Paragraph */}
				{editParagraphOptions.map((option, index) => (
					<ToggleButton
						key={index}
						onClick={() => option.onClick(editor)}
						disabled={!option.can(editor)}
						className={
							option.isActive?.(editor)
								? 'bg-accent text-bg-accent-foreground'
								: ''
						}
						shortcut={option.shortcut}
						tooltip={option.tooltip}
					>
						{option.icon(14)}
					</ToggleButton>
				))}

				<Separator
					orientation="vertical"
					className="h-full min-h-[1.5rem]"
				/>

				{/* List */}
				{editListOptions.map((option, index) => (
					<ToggleButton
						key={index}
						onClick={() => option.onClick(editor)}
						disabled={!option.can(editor)}
						className={
							option.isActive?.(editor)
								? 'bg-accent text-bg-accent-foreground'
								: ''
						}
						shortcut={option.shortcut}
						tooltip={option.tooltip}
					>
						{option.icon(14)}
					</ToggleButton>
				))}

				<Separator
					orientation="vertical"
					className="h-full min-h-[1.5rem]"
				/>

				{/* Align */}
				{editAlignOptions.map((option, index) => (
					<ToggleButton
						key={index}
						onClick={() => option.onClick(editor)}
						disabled={!option.can(editor)}
						className={
							option.isActive?.(editor)
								? 'bg-accent text-bg-accent-foreground'
								: ''
						}
						shortcut={option.shortcut}
						tooltip={option.tooltip}
					>
						{option.icon(14)}
					</ToggleButton>
				))}

				<Separator
					orientation="vertical"
					className="h-full min-h-[1.5rem]"
				/>

				{/* Misc */}
				{editMiscOptions.map((option, index) => (
					<ToggleButton
						key={index}
						onClick={() => option.onClick(editor)}
						disabled={!option.can(editor)}
						className={
							option.isActive?.(editor)
								? 'bg-accent text-bg-accent-foreground'
								: ''
						}
						shortcut={option.shortcut}
						tooltip={option.tooltip}
					>
						{option.icon(14)}
					</ToggleButton>
				))}

				<Separator
					orientation="vertical"
					className="h-full min-h-[1.5rem]"
				/>

				{/* Undo/Redo */}
				{editHistoryOptions.map((option, index) => (
					<ToggleButton
						key={index}
						onClick={() => option.onClick(editor)}
						disabled={!option.can(editor)}
						className={
							option.isActive?.(editor)
								? 'bg-accent text-bg-accent-foreground'
								: ''
						}
						shortcut={option.shortcut}
						tooltip={option.tooltip}
					>
						{option.icon(14)}
					</ToggleButton>
				))}

				<Separator
					orientation="vertical"
					className="h-full min-h-[1.5rem]"
				/>

				{/* Media */}
				<ToggleButton
					onClick={useCallback(() => {
						const url = window.prompt('URL')
						const alt = window.prompt('Alt')
						const title = window.prompt('Title')

						if (url) {
							editor
								.chain()
								.focus()
								.setImage({
									src: url,
									alt: alt || 'Image',
									title: title || 'Image',
								})
								.run()
						}
					}, [editor])}
					disabled={false}
					tooltip="Insert Image"
				>
					<Image size={14} />
				</ToggleButton>

				<ToggleButton
					onClick={useCallback(() => {
						const url = window.prompt('URL')
						const width =
							prompt('Enter width (default: 640)') || '640'
						const height =
							prompt('Enter height (default: 480)') || '480'

						if (url && width && height) {
							editor.commands.setYoutubeVideo({
								src: url,
								width: Math.max(320, parseInt(width)),
								height: Math.max(180, parseInt(height)),
							})
						}
					}, [editor])}
					disabled={false}
					tooltip="Insert Youtube"
				>
					<Youtube />
				</ToggleButton>
			</div>
		</div>
	)
}
