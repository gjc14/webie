import { mergeAttributes, Node, Command } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import MarkdownIt from 'markdown-it'

import Component from './component'
import { Provider } from '~/routes/_webie.admin.api.ai.chat'

interface StreamViewAttributes {
    prompt: string
    provider: Provider
    content?: string
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        streamView: {
            setStreamView: (attrs: StreamViewAttributes) => ReturnType
            saveStreamView: (pos: number, content: string) => ReturnType
            removeStreamView: () => ReturnType
            updateStreamContent: (pos: number, content: string) => ReturnType
        }
    }
}

export const StreamView = Node.create<StreamViewAttributes>({
    name: 'streamView',

    group: 'block',

    atom: true,

    addAttributes() {
        return {
            prompt: {
                default: '',
            },
            provider: {
                default: '',
            },
            content: {
                default: '',
            },
        }
    },

    addCommands() {
        return {
            setStreamView:
                (attrs: StreamViewAttributes): Command =>
                ({ tr, dispatch }) => {
                    if (dispatch) {
                        let existingNodePos = null

                        tr.doc.descendants((node, pos) => {
                            if (node.type.name === 'streamView') {
                                existingNodePos = pos
                                return false
                            }
                            return true
                        })

                        if (existingNodePos !== null) {
                        } else {
                            const node = this.type.create(attrs)
                            tr.replaceSelectionWith(node)
                        }
                    }
                    return true
                },

            saveStreamView:
                (pos: number, content: string): Command =>
                ({ tr, editor }) => {
                    // Get the current stream view node
                    const node = tr.doc.nodeAt(pos)
                    if (!node) return false

                    const md = new MarkdownIt()
                    const htmlContent = md.render(content)

                    // Chain remove this stream view node and insert the converted html content
                    editor
                        .chain()
                        .focus()
                        .deleteRange({ from: pos, to: pos + node.nodeSize })
                        .insertContent(htmlContent)
                        .run()

                    return true
                },

            removeStreamView:
                (): Command =>
                ({ tr, state, dispatch }) => {
                    if (dispatch) {
                        // Find all stream view nodes
                        const positions: number[] = []
                        state.doc.descendants((node, pos) => {
                            if (node.type.name === this.name) {
                                positions.push(pos)
                            }
                        })

                        // Delete them in reverse order to maintain positions
                        positions.reverse().forEach(pos => {
                            const node = state.doc.nodeAt(pos)
                            if (node) {
                                tr.delete(pos, pos + node.nodeSize)
                            }
                        })
                    }
                    return true
                },

            updateStreamContent:
                (pos: number, content: string): Command =>
                ({ tr, dispatch }) => {
                    if (dispatch) {
                        const node = tr.doc.nodeAt(pos)
                        if (!node) return false

                        tr.setNodeAttribute(pos, 'content', content)
                    }
                    return true
                },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'stream-view',
                getAttrs: dom => {
                    if (!(dom instanceof HTMLElement)) return false
                    return {
                        prompt: dom.getAttribute('data-prompt'),
                        provider: dom.getAttribute('data-provider'),
                        content: dom.getAttribute('data-content'),
                    }
                },
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'stream-view',
            mergeAttributes(HTMLAttributes, {
                'data-prompt': HTMLAttributes.prompt,
                'data-provider': HTMLAttributes.provider,
                'data-content': HTMLAttributes.content,
            }),
        ]
    },

    addNodeView() {
        return ReactNodeViewRenderer(Component)
    },
})
