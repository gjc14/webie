import { User } from '@prisma/client'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { Copy, CopyCheck, SendHorizonal, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { ScrollArea } from '~/components/ui/scroll-area'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'
import { Textarea } from '~/components/ui/textarea'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '~/components/ui/tooltip'
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
    Gemini: 'gemini-1.5-flash',
    OpenAI: 'gpt-4o-mini (Paid)',
} as const
export const providersArray = Object.values(providers) as Array<
    (typeof providers)[keyof typeof providers]
>

export type Providers = typeof providers
export type Provider = (typeof providers)[keyof typeof providers]

export const isProvider = (provider: any): provider is Provider => {
    const providersArray = Object.values(providers)
    return providersArray.includes(provider)
}

export const aiResponseSchama = z.object({
    provider: z.enum([providersArray[0], ...providersArray.slice(1)]),
    response: z.string(),
    id: z.string(),
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
    const id = formData.get('id')

    if (
        !prompt ||
        typeof prompt !== 'string' ||
        !provider ||
        typeof provider !== 'string' ||
        !isProvider(provider) ||
        !id ||
        typeof id !== 'string'
    ) {
        throw new Response('Invalid argument', { status: 400 })
    }

    let response: string | null = null
    try {
        switch (provider) {
            case 'gemini-1.5-flash':
                response = await GeminiCompletion({ prompt })
                break
            case 'gpt-4o-mini (Paid)':
                response = await OpenAICompletion({ prompt })
                break
            default:
                throw new Error('Invalid provider')
        }

        const responseData: AIResponse = {
            provider,
            response: response ?? 'No response',
            id: id,
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
    const [provider, setProvider] = useState<Provider>(providers.Gemini)
    const isLoading = fetcher.state !== 'idle'
    const [newResponse, setNewResponse] = useState<AIResponse | null>(null)
    const [revealing, setRevealing] = useState(false)
    const [chats, setChats] = useState<(AIResponse | { prompt: string })[]>([])

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
                setNewResponse(data)
                setRevealing(true)
                setChats(prev => [...prev, data])
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
        setChats(prev => [...prev, { prompt }])
        fetcher.submit(
            { prompt, provider, id: Date.now().toString() },
            { method: 'POST' }
        )
        if (promptRef.current) {
            promptRef.current.value = ''
        }
    }

    return (
        <AdminSectionWrapper className="relative overflow-auto">
            <AdminHeader>
                <AdminTitle description="Generative AI powers all the content generating for you!">
                    Generative AI
                </AdminTitle>
                <AdminActions>
                    <Label htmlFor="provider">Select your ai assitant</Label>
                    <SelectProvider
                        providers={providers}
                        defaultValue={providers.Gemini}
                        onValueChange={v => setProvider(v)}
                    />
                </AdminActions>
            </AdminHeader>
            <Separator />

            <ScrollArea className="flex-grow">
                <div className="max-w-3xl mx-auto space-y-12 px-3 sm:px-5">
                    <ChatUser chat="" user={undefined} />
                    <ChatAI chat="" />
                    <ChatUser chat="" user={undefined} />
                    <ChatAI chat="" />
                    <ChatUser chat="" user={undefined} />
                    <ChatAI chat="" />
                    <ChatUser chat="" user={undefined} />
                    <ChatAI chat="" />
                    <ChatUser chat="" user={undefined} />
                    <ChatAI chat="" />
                </div>
            </ScrollArea>

            <div className="space-y-1 max-w-3xl w-full mx-auto">
                <div className="flex py-1 px-2 border rounded-3xl bg-accent sm:mx-6 lg:mx-8">
                    <Textarea
                        ref={promptRef}
                        id="prompt"
                        name="prompt"
                        placeholder="Type your prompt here..."
                        className="resize-none min-h-fit max-h-60 border-0 focus-visible:ring-0"
                        rows={1}
                        autoSize
                        onKeyDown={e => {
                            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                                handleSubmit()
                            }
                        }}
                    />
                    <div className="h-full self-end mr-1">
                        <Button
                            onClick={handleSubmit}
                            variant={'ghost'}
                            size={'icon'}
                            className="align-baseline hover:bg-transparent"
                        >
                            <SendHorizonal size={16} />
                        </Button>
                    </div>
                </div>
                <p className="max-w-xl px-3 mx-auto text-center text-xs text-muted-foreground text-pretty">
                    AI generated content may be wrong, please make sure you
                    check all the informations.
                </p>
            </div>
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
                {Object.values(providers).map(value => (
                    <SelectItem key={value} value={value}>
                        {value}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

const ChatUser = ({ chat, user }: { chat: string; user?: User }) => {
    const [copied, setCopied] = useState(false)

    return (
        <div className="max-w-[75%] flex items-start justify-end gap-2 ml-auto">
            <div className="grid space-y-2 border rounded-3xl px-[2ch] py-[1.5ch] bg-accent/60">
                <p className="text-pretty">
                    The chat will be shown here. The chat will be shown here.
                    The chat will be shown here. The chat will be shown here.
                    The chat will be shown here. The chat will be shown here.
                    The chat will be shown here. The chat will be shown here.
                    The chat will be shown here. The chat will be shown here.
                    The chat will be shown here. The chat will be shown here.
                    The chat will be shown here. The chat will be shown here.
                    The chat will be shown here. The chat will be shown here.
                    The chat will be shown here. The chat will be shown here.
                    The chat will be shown here. The chat will be shown here.
                    The chat will be shown here. The chat will be shown here.
                    The chat will be shown here. The chat will be shown here.
                    The chat will be shown here. The chat will be shown here.
                    The chat will be shown here. The chat will be shown here.
                    The chat will be shown here. The chat will be shown here.
                    The chat will be shown here. The chat will be shown here.
                    The chat will be shown here. The chat will be shown here.
                    The chat will be shown here.T he chat will be shown here.
                    The chat will be shown here. The chat will be shown here.
                    The chat will be shown here. The chat will be shown here.
                </p>
                <div className="flex items-center gap-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={'ghost'}
                                    size={'icon-sm'}
                                    onClick={async () => {
                                        navigator.clipboard.writeText(chat)
                                        setCopied(true)
                                        await new Promise(resolve =>
                                            setTimeout(resolve, 2000)
                                        )
                                        setCopied(false)
                                    }}
                                >
                                    {copied ? <CopyCheck /> : <Copy />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            <Avatar className="h-8 w-8 flex items-center justify-center rounded-full">
                <AvatarImage
                    src={
                        user?.imageUri
                            ? user.imageUri
                            : '/placeholders/avatar.png'
                    }
                    alt={
                        user?.name
                            ? user.name
                                ? user.name
                                : user.email
                            : 'user'
                    }
                />
                <AvatarFallback className="rounded-lg">WB</AvatarFallback>
            </Avatar>
        </div>
    )
}

const ChatAI = ({ chat }: { chat: string }) => {
    const [copied, setCopied] = useState(false)

    return (
        <div className="flex items-start justify-start gap-5">
            <Avatar className="h-8 w-8 flex items-center justify-center rounded-full bg-violet-200 dark:bg-violet-500">
                <Sparkles
                    size={20}
                    strokeWidth={1.5}
                    className="animate-pulse"
                />
            </Avatar>
            <div className="grid space-y-2">
                <p className="text-pretty max-w-[80%]">
                    The response will be shown here The response will be shown
                    here The response will be shown here The response will be
                    shown here The response will be shown here The response will
                    be shown here The response will be shown here The response
                    will be shown here The response will be shown here The
                    response will be shown here The response will be shown here
                    The response will be shown here The response will be shown
                    here The response will be shown here The response will be
                    shown here The response will be shown here The response will
                    be shown here The response will be shown here The response
                    will be shown here The response will be shown here The
                    response will be shown here The response will be shown here
                    The response will be shown here The response will be shown
                    here The response will be shown here The response will be
                    shown here The response will be shown here The response will
                    be shown here The response will be shown here The response
                    will be shown here The response will be shown here The
                    response will be shown here The response will be shown here
                    The response will be shown here The response will be shown
                    here The response will be shown here The response will be
                    shown here The response will be shown here The response will
                    be shown here The response will be shown here The response
                    will be shown here The response will be shown here The
                    response will be shown here The response will be shown here
                    The response will be shown here The response will be shown
                    here The response will be shown here The response will be
                    shown here The response will be shown here The response will
                    be shown here The response will be shown here The response
                    will be shown here The response will be shown here The
                    response will be shown here The response will be shown here
                    The response will be shown here The response will be shown
                    here The response will be shown here The response will be
                    shown here The response will be shown here The response will
                    be shown here The response will be shown here The response
                    will be shown here The response will be shown here The
                    response will be shown here The response will be shown here
                    The response will be shown here The response will be shown
                    here The response will be shown here The response will be
                    shown here The response will be shown here The response will
                    be shown here The response will be shown here The response
                    will be shown here The response will be shown here The
                    response will be shown here The response will be shown here
                    The response will be shown here The response will be shown
                    here The response will be shown here The response will be
                    shown here The response will be shown here The response will
                    be shown here The response will be shown here The response
                    will be shown here The response will be shown here The
                    response will be shown here The response will be shown here
                    The response will be shown here The response will be shown
                    here
                </p>
                <div className="flex items-center gap-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={'ghost'}
                                    size={'icon-sm'}
                                    onClick={async () => {
                                        navigator.clipboard.writeText(chat)
                                        setCopied(true)
                                        await new Promise(resolve =>
                                            setTimeout(resolve, 2000)
                                        )
                                        setCopied(false)
                                    }}
                                >
                                    {copied ? <CopyCheck /> : <Copy />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    )
}
