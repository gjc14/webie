import { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

// Usage: papacms.com/assets/my-file-key?visibility=public
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const { searchParams } = new URL(request.url)

    const status = searchParams.get('status')
    const statusText = searchParams.get('statusText')

    return { status, statusText }
}

export default function AssetsError() {
    const { status, statusText } = useLoaderData<typeof loader>()

    return (
        <div className="h-screen w-screen grow flex flex-col items-center justify-center">
            <h1>Asset Error</h1>
            <p>
                {status || '999'} | {statusText || 'Unknown error'}
            </p>
        </div>
    )
}
