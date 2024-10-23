import { ActionFunctionArgs, json } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { Send } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { Textarea } from '~/components/ui/textarea'
import { userIs } from '~/lib/db/auth.server'
import { OpenAICompletion } from '~/lib/generative-ai'
import {
    ConventionalError,
    ConventionalSuccess,
    isConventionalError,
    isConventionalSuccess,
} from '~/lib/utils'
import {
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_webie.admin/components/admin-wrapper'

export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== 'POST') {
        throw new Response('Method not allowed', { status: 405 })
    }

    const admin = await userIs(request, 'ADMIN', '/admin/signin')

    const formData = await request.formData()
    const prompt = formData.get('prompt')

    if (!prompt || typeof prompt !== 'string') {
        throw new Response('Invalid argument', { status: 400 })
    }

    try {
        const response = await OpenAICompletion({ prompt })

        return json<ConventionalSuccess>({
            msg: 'Success',
            data: {
                provider: 'OpenAI',
                model: 'GPT-4o',
                response: 'Hello, how can I help you today?',
            },
        })
    } catch (error) {
        console.error(error)
        return json<ConventionalError>(
            { err: 'Failed to generate response' },
            { status: 500 }
        )
    }
}

export default function AdminGenerativeAI() {
    const fetcher = useFetcher()
    const promptRef = useRef<HTMLTextAreaElement>(null)
    const responseRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        const response = fetcher.data
        if (!response) {
            return
        }
        if (isConventionalSuccess(response)) {
            console.log(response)
        }
    }, [fetcher.data])

    const handleSubmit = () => {
        const prompt = promptRef.current?.value
        if (!prompt) {
            return
        }
        fetcher.submit({ prompt }, { method: 'POST' })
    }

    return (
        <AdminSectionWrapper className="h-full">
            <AdminHeader>
                <AdminTitle description="Generative AI powers all the content generating for you!">
                    Generative AI
                </AdminTitle>
            </AdminHeader>
            <Separator />
            <section className="h-full grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-5">
                <div className="relative h-fit">
                    <Label htmlFor="prompt">Prompt</Label>
                    <Textarea
                        ref={promptRef}
                        id="prompt"
                        name="prompt"
                        placeholder="Type your prompt here..."
                    />
                    <Button
                        onClick={handleSubmit}
                        variant={'ghost'}
                        size={'icon'}
                        className="absolute bottom-3 right-3"
                    >
                        <Send size={16} />
                    </Button>
                </div>
                <div>
                    <Label htmlFor="response">Response</Label>
                    <Textarea
                        ref={responseRef}
                        id="response"
                        name="response"
                        placeholder="Submit your prompt to generate response..."
                        readOnly
                        className="h-full resize-none"
                    />
                </div>
            </section>
        </AdminSectionWrapper>
    )
}
