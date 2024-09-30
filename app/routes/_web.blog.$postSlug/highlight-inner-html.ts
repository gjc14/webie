/**
 * This file follows the same logic of 'lowlight' usage in Tiptap code block extension @tiptap/extension-code-block-lowlight.
 * see: https://github.com/ueberdosis/tiptap/tree/develop/packages/extension-code-block-lowlight/src
 * docs: https://tiptap.dev/docs/editor/extensions/nodes/code-block-lowlight
 */

import highlight from 'highlight.js'

function parseNodes(
    nodes: any[],
    className: string[] = []
): { text: string; classes: string[] }[] {
    return nodes
        .map(node => {
            const classes = [
                ...className,
                ...(node.properties ? node.properties.className : []),
            ]

            if (node.children) {
                return parseNodes(node.children, classes)
            }

            return {
                text: node.value,
                classes,
            }
        })
        .flat()
}

function isFunction(param: Function) {
    return typeof param === 'function'
}

export function hilightInnerHTML(
    block: Element,
    lowlight: any,
    languages: string[] = []
) {
    if (
        !['highlight', 'highlightAuto', 'listLanguages'].every(api =>
            isFunction(lowlight[api])
        )
    ) {
        throw Error(
            'You should provide an instance of lowlight to use the code-block-lowlight extension'
        )
    }

    const language = block.className.replace('language-', '')

    const content = block.textContent
    if (!content) return

    let result
    if (
        language &&
        (languages.includes(language) ||
            Boolean(highlight.getLanguage(language)) ||
            lowlight.registered?.(language))
    ) {
        result = lowlight.highlight(language, content)
    } else {
        result = lowlight.highlightAuto(content)
    }
    const nodes = result.children // `.value` for lowlight v1, `.children` for lowlight v2

    let innerHTML = ''
    parseNodes(nodes).forEach(node => {
        const text = node.text

        if (node.classes.length) {
            const classes = node.classes.join(' ')

            innerHTML += `<span class="${classes}">${text}</span>`
        } else {
            innerHTML += text
        }
        block.innerHTML = innerHTML
    })
}
