import { LoaderFunctionArgs } from '@remix-run/node'
import {
    isRouteErrorResponse,
    Link,
    Outlet,
    useLoaderData,
    useRouteError,
} from '@remix-run/react'
import { Settings } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { authCookie } from '~/lib/db/auth.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
    // TODO: efficiently check if user could access to /admin page
    const cookieString = request.headers.get('Cookie')
    if (!cookieString) return { user: null }

    const cookie = await authCookie.parse(cookieString)
    if (cookie) {
        return { user: cookie }
    } else {
        return { user: null }
    }
}

export default function WebFront() {
    const { user } = useLoaderData<typeof loader>()

    return (
        <>
            {user && (
                <Link to={'/admin'}>
                    <Button
                        variant="ghost"
                        size={'icon'}
                        className="fixed right-1 bottom-1"
                        aria-label="go to admin page"
                    >
                        <Settings />
                    </Button>
                </Link>
            )}
            <Outlet />
        </>
    )
}

export function ErrorBoundary() {
    const error = useRouteError()

    // throw new Response()
    if (isRouteErrorResponse(error)) {
        console.error('Error response:', error.data)
        return (
            <main className="w-screen h-screen flex flex-col items-center justify-center">
                <div className="flex flex-1 flex-col justify-center text-primary">
                    <h1 className="text-center font-mono">{error.status}</h1>
                    <a
                        className="text-center inline-block underline"
                        href={`https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${error.status}`}
                    >
                        why this error?
                    </a>
                </div>
            </main>
        )
    } else if (error instanceof Error) {
        // throw new Error('message')
        return (
            <main className="w-screen h-screen flex flex-col items-center justify-center">
                <div className="flex flex-1 flex-col justify-center text-primary">
                    <h1 className="text-center font-mono">500</h1>
                    <p>Internal Server Error</p>
                    <a
                        href="mailto:your@ema.il"
                        className="text-center inline-block underline"
                    >
                        Report this error
                    </a>
                </div>
            </main>
        )
    }

    return (
        <main className="w-screen h-screen flex flex-col items-center justify-center">
            <div className="flex flex-1 flex-col justify-center text-primary">
                <h1 className="text-center font-mono">Unknown Error</h1>
                <a
                    href="mailto:your@ema.il"
                    className="text-center inline-block underline"
                >
                    Report this error
                </a>
            </div>
        </main>
    )
}
