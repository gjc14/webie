import { Tag } from '@prisma/client'
import { useFetcher, useFetchers, useSubmit } from '@remix-run/react'
import { ObjectId } from 'bson'
import { XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '~/components/ui/badge'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

const actionRoute = '/admin/blog/taxonomy/resource'

const usePendingTags = (): Tag[] => {
    const matchedFetchers = useFetchers().filter(fetcher => {
        if (!fetcher.formData) return false
        return fetcher.formData.get('intent') === 'tag'
    })
    return matchedFetchers.map(fetcher => {
        return {
            id: String(fetcher.formData?.get('id')),
            name: String(fetcher.formData?.get('name')),
            postIDs: [],
        }
    })
}

const TagPart = (props: { tags: Tag[] | null }) => {
    const submit = useSubmit()
    const [tagValue, setTagValue] = useState<string>('')
    const [isComposing, setIsComposing] = useState(false)

    const pendingItems = usePendingTags()
    for (let item of pendingItems) {
        if (!props.tags?.some(tag => tag.id === item.id)) {
            props.tags?.push(item)
        }
    }

    const addTag = (tag: string) => {
        submit(
            { id: String(new ObjectId()), name: tag.trim(), intent: 'tag' },
            { method: 'POST', action: actionRoute, navigate: false }
        )
        setTagValue('')
    }

    // Check enterd value
    useEffect(() => {
        if (
            tagValue &&
            (tagValue[tagValue.length - 1] === ';' ||
                tagValue[tagValue.length - 1] === ',')
        ) {
            addTag(tagValue.split(tagValue[tagValue.length - 1])[0])
        }
    }, [tagValue])

    return (
        <div className="grid gap-1.5">
            <Label htmlFor="tag" className="flex items-center gap-x-1.5">
                Tag
            </Label>
            <Input
                id="tag"
                name="tag"
                type="text"
                value={tagValue}
                placeholder="Tag name"
                onChange={e => setTagValue(e.target.value)}
                onKeyDown={e => {
                    ;(e.key === 'Enter' || e.key === 'Tab') &&
                        !isComposing &&
                        addTag(tagValue)
                }}
                onCompositionStart={() => {
                    setIsComposing(true)
                }}
                onCompositionEnd={() => {
                    setIsComposing(false)
                }}
            />
            {props.tags && props.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 items-center">
                    {props.tags.map(tag => (
                        <TagItem key={tag.id} tag={tag} />
                    ))}
                </div>
            )}
        </div>
    )
}

const TagItem = (props: { tag: Tag }) => {
    const fetcher = useFetcher()
    const isDeleting = fetcher.formData?.get('id') === props.tag.id

    return (
        <div
            className={`flex gap-0.5 items-center ${
                isDeleting ? 'hidden' : ''
            }`}
        >
            <Badge>{props.tag.name}</Badge>
            <XCircle
                className="h-4 w-4 cursor-pointer"
                onClick={() => {
                    fetcher.submit(
                        { id: props.tag.id, intent: 'tag' },
                        { method: 'DELETE', action: actionRoute }
                    )
                }}
            />
        </div>
    )
}

export { TagPart }
