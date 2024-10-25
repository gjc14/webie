import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { User } from '@prisma/client'
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { CoreMessage, streamText } from 'ai'
import { useChat } from 'ai/react'
import { CheckCheck, Copy, SendHorizonal, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
import { getUserById } from '~/lib/db/user.server'
import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_webie.admin/components/admin-wrapper'
import { LoaderHR } from './components/loader'

const googleModels = [
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest',
] as const
const openaiModels = [
    'o1-mini',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-3.5-turbo',
] as const

export const providers = [...googleModels, ...openaiModels] as const

export type Providers = typeof providers
export type Provider = Providers[number]

export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== 'POST') {
        throw new Response('Method not allowed', { status: 405 })
    }

    const admin = await userIs(request, 'ADMIN', '/admin/signin')

    const {
        messages,
        provider,
    }: { messages: CoreMessage[]; provider: Provider } = await request.json()

    if (googleModels.includes(provider as (typeof googleModels)[number])) {
        const result = await streamText({
            model: google(provider),
            system: 'You are a helpful assistant.',
            messages,
        })
        return result.toDataStreamResponse()
    } else if (
        openaiModels.includes(provider as (typeof openaiModels)[number])
    ) {
        const result = await streamText({
            model: openai(provider),
            system: 'You are a helpful assistant.',
            messages,
        })
        return result.toDataStreamResponse()
    } else {
        return null
    }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { id: userId } = await userIs(request, 'ADMIN', '/admin/signin')

    const { user } = await getUserById(userId)

    if (!user) {
        throw new Response('User not found', { status: 404 })
    }

    return json({ user })
}

export default function AdminGenerativeAI() {
    const { user } = useLoaderData<typeof loader>()
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const [isComposing, setIsComposing] = useState(false)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [provider, setProvider] = useState<Provider>(
        'gemini-1.5-flash-latest'
    )
    const { messages, input, handleSubmit, handleInputChange, isLoading } =
        useChat({
            api: '/admin/blog/generative?_data',
            body: {
                provider,
            },
            onResponse(response) {
                if (response.ok) {
                    setIsSubmitting(false)
                }
            },
        })

    const disabled = isLoading || input.trim() === ''

    const scrollToBottom = () => {
        // Find the actual scrollable viewport (it's a div with data-radix-scroll-area-viewport)
        const viewport = scrollAreaRef.current?.querySelector(
            '[data-radix-scroll-area-viewport]'
        )
        if (viewport) {
            try {
                viewport.scrollTo({
                    top: viewport.scrollHeight,
                    behavior: 'smooth',
                })
            } catch (error) {
                console.error('Scroll error:', error)
            }
        } else {
            console.warn('Viewport not found')
        }
    }

    const onSubmit = async () => {
        setIsSubmitting(true)
        handleSubmit()
    }

    useEffect(() => {
        const attemptScroll = () => {
            scrollToBottom()
            textAreaRef.current?.focus()
        }
        attemptScroll()
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

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
                        defaultValue={provider}
                        onValueChange={v => setProvider(v)}
                    />
                </AdminActions>
            </AdminHeader>
            <Separator />

            <ScrollArea className="flex-grow h-screen" ref={scrollAreaRef}>
                <div className="max-w-3xl mx-auto space-y-12 px-3 sm:px-5">
                    {messages.length !== 0 ? (
                        messages.map(message => {
                            if (message.role === 'user') {
                                return (
                                    <ChatUser
                                        key={message.id}
                                        message={message.content}
                                        user={{
                                            ...user,
                                            updatedAt: new Date(user.updatedAt),
                                        }}
                                    />
                                )
                            } else {
                                return (
                                    <ChatAI
                                        key={message.id}
                                        message={message.content}
                                    />
                                )
                            }
                        })
                    ) : (
                        <div className="grow px-2 mt-8 md:px-6">
                            <h3 className="w-fit text-5xl font-medium leading-normal bg-gradient-to-r from-sky-500 via-violet-500 to-fuchsia-700 dark:from-sky-200 dark:via-violet-400 dark:to-fuchsia-500 to-70% bg-clip-text text-transparent">
                                Good day with Webie!
                            </h3>
                            <h3 className="w-fit text-3xl font-medium leading-normal bg-gradient-to-r from-yellow-500 via-amber-600 to-orange-600 dark:from-yellow-50 dark:via-amber-100 dark:to-orange-200 bg-clip-text text-transparent">
                                Get your idea now with AI
                            </h3>
                        </div>
                    )}
                    {isLoading && isSubmitting && (
                        <div className="w-full gap-2.5 flex flex-col">
                            <LoaderHR className="via-30%" />
                            <LoaderHR className="via-50% delay-300" />
                            <LoaderHR className="via-70% delay-700" />
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="space-y-1 max-w-3xl w-full mx-auto">
                <div className="flex py-1 px-2 border rounded-3xl bg-accent sm:mx-6 lg:mx-8">
                    <Textarea
                        ref={textAreaRef}
                        id="prompt"
                        name="prompt"
                        placeholder="Type your prompt here..."
                        className="resize-none min-h-fit max-h-60 border-0 focus-visible:ring-0"
                        value={input}
                        onChange={handleInputChange}
                        rows={1}
                        autoSize
                        onCompositionStart={() => {
                            setIsComposing(true)
                        }}
                        onCompositionEnd={() => {
                            setIsComposing(false)
                        }}
                        onKeyDown={e => {
                            if (disabled || isComposing) return
                            if (
                                e.key === 'Enter' &&
                                !e.shiftKey &&
                                !e.metaKey &&
                                !e.ctrlKey &&
                                !e.altKey
                            ) {
                                e.preventDefault() // Prevents a new line with solo Enter
                                onSubmit()
                            }
                        }}
                    />
                    <div className="h-full self-end mr-1">
                        <Button
                            disabled={disabled}
                            onClick={onSubmit}
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

const ChatUser = ({ message, user }: { message: string; user?: User }) => {
    const [copied, setCopied] = useState(false)

    return (
        <div className="max-w-[75%] flex items-start justify-end gap-2 ml-auto">
            <div className="grid space-y-2 border rounded-3xl px-[2ch] py-[1.5ch] bg-accent/50">
                <p className="text-pretty">{message}</p>
                <div className="flex items-center gap-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={'ghost'}
                                    size={'icon-sm'}
                                    onClick={async () => {
                                        navigator.clipboard.writeText(message)
                                        setCopied(true)
                                        await new Promise(resolve =>
                                            setTimeout(resolve, 2000)
                                        )
                                        setCopied(false)
                                    }}
                                >
                                    {copied ? <CheckCheck /> : <Copy />}
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

const ChatAI = ({ message }: { message: string }) => {
    const [copied, setCopied] = useState(false)

    return (
        <div className="flex items-start justify-start gap-5">
            <Avatar className="h-8 w-8 flex items-center justify-center rounded-full bg-violet-200 dark:bg-violet-500">
                <Sparkles size={20} strokeWidth={1.5} />
            </Avatar>
            <div className="grid space-y-2">
                <article className="text-pretty max-w-[80%] prose">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message}
                    </ReactMarkdown>
                </article>
                <div className="flex items-center gap-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={'ghost'}
                                    size={'icon-sm'}
                                    onClick={async () => {
                                        navigator.clipboard.writeText(message)
                                        setCopied(true)
                                        await new Promise(resolve =>
                                            setTimeout(resolve, 2000)
                                        )
                                        setCopied(false)
                                    }}
                                >
                                    {copied ? <CheckCheck /> : <Copy />}
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
