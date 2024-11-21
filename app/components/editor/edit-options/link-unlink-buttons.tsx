import { PopoverClose } from '@radix-ui/react-popover'
import { Editor } from '@tiptap/react'
import { Link, Unlink } from 'lucide-react'
import { useCallback, useState } from 'react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '~/components/ui/popover'
import { ToggleButton } from '../components/toggle-button'

export const LinkUnlinkButtons = ({ editor }: { editor: Editor }) => {
    const [linkInput, setLinkInput] = useState('')

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href

        // did notion
        if (!previousUrl && !linkInput) return

        // remove
        if (!!previousUrl && !linkInput) {
            return editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .unsetLink()
                .run()
        }

        // update link
        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: linkInput })
            .run()
    }, [editor, linkInput])

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <ToggleButton
                        onClick={() => {
                            const previousUrl =
                                editor.getAttributes('link').href
                            setLinkInput(previousUrl ?? '')
                        }}
                        disabled={false}
                        tooltip="Set Link"
                        className={
                            editor.isActive('link')
                                ? 'bg-accent text-bg-accent-foreground'
                                : ''
                        }
                    >
                        <Link size={14} />
                    </ToggleButton>
                </PopoverTrigger>
                <PopoverContent>
                    <Label htmlFor="link">URL</Label>
                    <Input
                        id="link"
                        placeholder="https://webie.dev"
                        value={linkInput}
                        onChange={e => setLinkInput(e.target.value ?? '')}
                    />
                    <PopoverClose asChild className="w-full mt-2">
                        <Button onClick={() => setLink()}>Set Link</Button>
                    </PopoverClose>
                </PopoverContent>
            </Popover>

            <ToggleButton
                onClick={() => editor.chain().focus().unsetLink().run()}
                disabled={!editor.isActive('link')}
                tooltip="Unset Link"
            >
                <Unlink size={14} />
            </ToggleButton>
        </>
    )
}
