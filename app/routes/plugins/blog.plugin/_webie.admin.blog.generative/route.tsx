import { ActionFunctionArgs, json } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { Send } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'
import { Textarea } from '~/components/ui/textarea'
import { userIs } from '~/lib/db/auth.server'
import { GeminiCompletion, OpenAICompletion } from '~/lib/generative-ai.server'
import {
    ConventionalError,
    ConventionalSuccess,
    isConventionalSuccess,
} from '~/lib/utils'
import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_webie.admin/components/admin-wrapper'

export const providers = {
    Gemini: 'Gemini',
    OpenAI: 'OpenAI (Paid)',
} as const
export const providersArray = Object.keys(providers) as Array<
    keyof typeof providers
>

export type Providers = typeof providers
export type Provider = keyof Providers

export const isProvider = (provider: any): provider is Provider => {
    return Object.keys(providers).includes(provider)
}

export const aiResponseSchama = z.object({
    provider: z.enum([providersArray[0], ...providersArray.slice(1)]),
    response: z.string(),
})
export type AIResponse = z.infer<typeof aiResponseSchama>

export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== 'POST') {
        throw new Response('Method not allowed', { status: 405 })
    }

    const admin = await userIs(request, 'ADMIN', '/admin/signin')

    const formData = await request.formData()
    const prompt = formData.get('prompt')
    const provider = formData.get('provider')

    if (
        !prompt ||
        typeof prompt !== 'string' ||
        !provider ||
        typeof provider !== 'string' ||
        !isProvider(provider)
    ) {
        throw new Response('Invalid argument', { status: 400 })
    }

    let response: string | null = null
    try {
        switch (provider) {
            case 'Gemini':
                response = await GeminiCompletion({ prompt })
                break
            case 'OpenAI':
                response = await OpenAICompletion({ prompt })
                break
            default:
                throw new Error('Invalid provider')
        }

        const responseData: AIResponse = {
            provider,
            response: response ?? 'No response',
        }

        return json<ConventionalSuccess>({
            msg: 'Success',
            data: responseData,
            options: { preventAlert: true },
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
            const { success, data, error } = aiResponseSchama.safeParse(
                response.data
            )

            if (success) {
                console.log(
                    'provider:',
                    data.provider,
                    'response:',
                    data.response
                )
            } else {
                console.error(error || 'Failed to parse response')
            }
        }
    }, [fetcher.data])

    const handleSubmit = () => {
        const prompt = promptRef.current?.value
        if (!prompt) {
            toast.error('Enter your message to your ai assistant')
            return
        }
        fetcher.submit({ prompt, provider: 'Gemini' }, { method: 'POST' })
    }

    return (
        <AdminSectionWrapper className="h-full">
            <AdminHeader>
                <AdminTitle description="Generative AI powers all the content generating for you!">
                    Generative AI
                </AdminTitle>
                <AdminActions>
                    <Label htmlFor="provider">Select your ai assitant</Label>
                    <SelectProvider
                        providers={providers}
                        defaultValue={providers.Gemini}
                        onValueChange={console.log}
                    />
                </AdminActions>
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
                        className="resize-none"
                        autoSize
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

const SelectProvider = ({
    providers,
    defaultValue,
    onValueChange,
}: {
    providers: Providers
    defaultValue: Provider
    onValueChange: (provider: Provider) => void
}) => {
    return (
        <Select
            defaultValue={defaultValue}
            onValueChange={v => onValueChange(v as Provider)}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select ai agent" />
            </SelectTrigger>
            <SelectContent>
                {Object.entries(providers).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                        {value}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
