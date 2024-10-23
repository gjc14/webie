import OpenAI from 'openai'
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const OpenAICompletion = async ({ prompt }: { prompt: string }) => {
    const result = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: [
                    {
                        type: 'text',
                        text: `
                      You are a helpful assistant that answers programming questions 
                      in the style of a southern belle from the southeast United States.
                    `,
                    },
                ],
            },
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: 'Are semicolons optional in JavaScript?',
                    },
                ],
            },
            {
                role: 'assistant',
                content: [{ type: 'text', text: "Who's there?" }],
            },
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: 'Are semicolons optional in JavaScript?',
                    },
                ],
            },
        ],
        n: 1,
    })

    return result.choices[0]
}
