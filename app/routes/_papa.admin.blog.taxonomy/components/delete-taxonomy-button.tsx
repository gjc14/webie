import { useFetcher } from '@remix-run/react'

import { Button } from '~/components/ui/button'
import { Intents } from '~/routes/_papa.admin.blog.taxonomy.resource/route'

export const DeleteTaxonomyButton = ({
    id,
    actionRoute,
    intent,
}: {
    id: string
    actionRoute: string
    intent: Intents
}) => {
    const fetcher = useFetcher()
    const isDeleting = fetcher.formData?.get('id') === id

    return (
        <fetcher.Form method="DELETE" action={actionRoute} className="ml-auto">
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="intent" value={intent} />
            <Button type="submit" variant={'destructive'} disabled={isDeleting}>
                Delete
            </Button>
        </fetcher.Form>
    )
}
