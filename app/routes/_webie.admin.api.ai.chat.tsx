import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { type ActionFunctionArgs } from '@remix-run/node'
import { CoreMessage, streamText } from 'ai'
import { userIs } from '~/lib/db/auth.server'

export const googleModels = [
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest',
] as const
export const openaiModels = [
    'o1-mini',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-3.5-turbo',
] as const

export const providers = [...googleModels, ...openaiModels] as const

export type Providers = typeof providers
export type Provider = Providers[number]

export interface ChatAPICustomBody {
    provider: Provider
}

export async function action({ request }: ActionFunctionArgs) {
    if (request.method !== 'POST') {
        throw new Response('Method not allowed', { status: 405 })
    }

    const admin = await userIs(request, 'ADMIN', '/admin/signin')

    try {
        const {
            prompt,
            messages,
            provider,
        }: { prompt?: string; messages?: CoreMessage[] } & ChatAPICustomBody =
            await request.json()

        if (googleModels.includes(provider as (typeof googleModels)[number])) {
            const result = await streamText({
                model: google(provider),
                system: 'You are a helpful assistant.',
                messages,
                prompt,
            })
            const stream = result.toDataStream()

            // Return as a Response with the correct headers
            return new Response(stream, {
                status: 200,
                headers: new Headers({
                    'Content-Type': 'text/plain; charset=utf-8',
                    'X-Vercel-AI-Data-Stream': 'v1',
                }),
            })
        } else if (
            openaiModels.includes(provider as (typeof openaiModels)[number])
        ) {
            const result = await streamText({
                model: openai(provider),
                system: 'You are a helpful assistant.',
                messages,
                prompt,
            })
            const stream = result.toDataStream()

            // Return as a Response with the correct headers
            return new Response(stream, {
                status: 200,
                headers: new Headers({
                    'Content-Type': 'text/plain; charset=utf-8',
                    'X-Vercel-AI-Data-Stream': 'v1',
                }),
            })
        }
    } catch (error) {
        console.error('Streaming error:', error)
        return new Response('Streaming failed', { status: 500 })
    }
}
