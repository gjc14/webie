import { User } from '@prisma/client'
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
import {
    Provider,
    Providers,
    providers,
} from '~/routes/_webie.admin.api.ai.chat/route'
import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_webie.admin/components/admin-wrapper'
import { useAdminContext } from '~/routes/_webie.admin/route'
import { LoaderHR } from './components/loader'

export default function AdminGenerativeAI() {
    const { admin } = useAdminContext()
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const [isComposing, setIsComposing] = useState(false)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [provider, setProvider] = useState<Provider>(
        'gemini-1.5-flash-latest'
    )
    const { messages, input, handleSubmit, handleInputChange, isLoading } =
        useChat({
            api: '/admin/api/ai/chat',
            body: {
                provider,
            },
            onResponse(response) {
                if (response.ok) {
                    setIsSubmitting(false)
                }
                console.log('Response:', response)
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
                <AdminTitle
                    title="Generative AI"
                    description="Generative AI powers all the content generating for you!"
                ></AdminTitle>
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
                                            ...admin,
                                            updatedAt: new Date(
                                                admin.updatedAt
                                            ),
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
