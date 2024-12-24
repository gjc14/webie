import { PopoverClose } from '@radix-ui/react-popover'
import { Editor } from '@tiptap/react'
import { Image } from 'lucide-react'
import { useRef } from 'react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '~/components/ui/popover'
import { ToggleButton } from '../components/toggle-button'

export const ImageButton = ({ editor }: { editor: Editor }) => {
    const urlInputRef = useRef<HTMLInputElement>(null)
    const altInputRef = useRef<HTMLInputElement>(null)
    const titleInputRef = useRef<HTMLInputElement>(null)

    return (
        <Popover>
            <PopoverTrigger asChild>
                <ToggleButton disabled={false} tooltip="Insert Image">
                    <Image size={14} />
                </ToggleButton>
            </PopoverTrigger>

            <PopoverContent className="w-96">
                <div className="grid gap-3">
                    <div className="space-y-2">
                        <h4>Dimensions</h4>
                        <p className="text-sm text-muted-foreground">
                            Set the dimensions for your Image.
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-1">
                            <Label htmlFor="url">URL</Label>
                            <Input
                                ref={urlInputRef}
                                id="url"
                                placeholder="https://papacms.com/logo.svg"
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-1">
                            <Label htmlFor="alt">Alt</Label>
                            <Input
                                ref={altInputRef}
                                id="alt"
                                placeholder="alt"
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-1">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                ref={titleInputRef}
                                id="title"
                                placeholder="title"
                                className="col-span-2 h-8"
                            />
                        </div>
                    </div>

                    <footer>
                        <PopoverClose asChild>
                            <Button
                                className="w-full"
                                onClick={() => {
                                    const url = urlInputRef.current?.value
                                    const alt = altInputRef.current?.value
                                    const title = titleInputRef.current?.value

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
                                }}
                            >
                                Insert Youtube
                            </Button>
                        </PopoverClose>
                    </footer>
                </div>
            </PopoverContent>
        </Popover>
    )
}
