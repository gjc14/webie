const assist = {
    beforePrompt:
        'You are a helpful assistant that answers programming questions in the style of a southern belle from the southeast United States',
    afterPrompt:
        'You think step by step and make a detailed and responsible answer',
}

//////////////////////////////////////////
////                                  ////
////              Gemini              ////
////                                  ////
//////////////////////////////////////////
import { GoogleGenerativeAI } from '@google/generative-ai'

let gemini: GoogleGenerativeAI | null
if (process.env.GEMINI_API_KEY) {
    gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
} else {
    console.warn('GEMINI_API_KEY not found')
}

export const GeminiCompletion = async ({ prompt }: { prompt: string }) => {
    if (!gemini) {
        return null
    }

    const result = await gemini
        .getGenerativeModel({
            model: 'gemini-1.5-flash',
        })
        .generateContent(
            `${assist.beforePrompt}. ${prompt}. ${assist.afterPrompt}.`
        )
    const response = result.response

    const text = response.text()

    return text
}

///////////////////////////////////////////
////                                   ////
////              OPEN AI              ////
////                                   ////
///////////////////////////////////////////
import OpenAI from 'openai'

let openai: OpenAI | null
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
} else {
    console.warn('OPENAI_API_KEY not found')
}

export const OpenAICompletion = async ({
    system = assist.beforePrompt,
    prompt,
    assistant = assist.afterPrompt,
}: {
    system?: string
    prompt: string
    assistant?: string
}) => {
    if (!openai) {
        return null
    }

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'system',
                content: [{ type: 'text', text: system }],
            },
            {
                role: 'user',
                content: [{ type: 'text', text: prompt }],
            },
            {
                role: 'assistant',
                content: [{ type: 'text', text: assistant }],
            },
        ],
        n: 1,
    })

    const text = response.choices[0].message.content

    return text
}
