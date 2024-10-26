import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { useCompletion } from 'ai/react'
import { Loader, StopCircle } from 'lucide-react'
import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Button } from '~/components/ui/button'

export default (props: NodeViewProps) => {
    const { node, editor, getPos } = props
    const prompt = node.attrs.prompt
    const provider = node.attrs.provider

    // AI
    const { completion, complete, isLoading, stop } = useCompletion({
        api: '/admin/api/ai/chat',
        body: {
            provider: provider,
        },
    })

    useEffect(() => {
        if (!prompt) return
        console.log('Prompt:', prompt)
        complete(prompt)
    }, [])

    useEffect(() => {
        if (!completion) return

        const pos = getPos()
        console.log('Completion:', completion)

        // Update the node's content attribute as streaming happens
        editor.commands.updateStreamContent(pos, completion)
    }, [completion])

    // Handle stream data
    const handleSave = () => {
        if (!editor) return

        const pos = getPos()

        // Save the streaming content as regular text
        editor.commands.saveStreamView(pos, completion)
    }

    const handleDiscard = () => {
        if (!editor) return

        // Remove the streaming preview node
        editor.commands.removeStreamView()
    }

    return (
        <NodeViewWrapper className="relative flex flex-col items-center p-3 gap-3 border rounded-lg">
            <div className="w-full flex justify-end gap-2 pb-3 border-b">
                {!isLoading ? (
                    <>
                        <Button
                            variant={'destructive'}
                            size={'sm'}
                            onClick={handleDiscard}
                        >
                            Discard result
                        </Button>
                        <Button
                            variant={'outline'}
                            size={'sm'}
                            onClick={handleSave}
                        >
                            Save response
                        </Button>
                    </>
                ) : (
                    <Button variant={'destructive'} size={'sm'} onClick={stop}>
                        <StopCircle />
                        Stop
                    </Button>
                )}
            </div>

            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className={'text-muted-foreground'}
            >
                {completion}
            </ReactMarkdown>

            {isLoading && <Loader className="animate-spin-slow" />}
        </NodeViewWrapper>
    )
}
