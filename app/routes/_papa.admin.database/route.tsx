import { LoaderFunctionArgs } from '@remix-run/node'

export const loader = async ({ request }: LoaderFunctionArgs) => {
    return null
}

export default function Database() {
    return (
        <div className="grow flex items-center justify-center text-center">
            Database service
            <br />
            Coming soon
        </div>
    )
}
