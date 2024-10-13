import { useRef, useState } from 'react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { cn } from '~/lib/utils'
import { ColumnSettingsCardState } from '..'

const APIMethods = ['GET', 'POST', 'PUT', 'DELETE'] as const
type APIMethods = (typeof APIMethods)[number]

export const APISettingCard = ({
    colDefStateInPopover,
    setColDefStateInPopover,
    className,
}: ColumnSettingsCardState & { className?: string }) => {
    const [method, setMethod] = useState<APIMethods>()
    const [response, setResponse] = useState<string>()
    const urlRef = useRef<HTMLInputElement>(null)
    const bodyRef = useRef<HTMLTextAreaElement>(null)

    const testAPI = async (method: APIMethods) => {
        const url = urlRef.current?.value
        if (!url) return
        console.log(url, method)

        let response
        try {
            switch (method) {
                case 'GET':
                    response = await fetch(url, {
                        mode: 'cors',
                    })
                    break
                case 'POST':
                    response = await fetch(url, {
                        mode: 'cors',
                        method: 'POST',
                        body: JSON.stringify(bodyRef.current?.value),
                    })
                    break
                case 'PUT':
                    response = await fetch(url, {
                        mode: 'cors',
                        method: 'PUT',
                        body: JSON.stringify(bodyRef.current?.value),
                    })
                    break
                case 'DELETE':
                    response = await fetch(url, {
                        mode: 'cors',
                        method: 'DELETE',
                        body: JSON.stringify(bodyRef.current?.value),
                    })
                    break
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            console.log(response.status, data)
            setResponse(JSON.stringify(data))
        } catch (error) {
            console.error('API Error:', error)
            setResponse('' + error)
        }
    }

    return (
        <div className={cn('space-y-2', className)}>
            <div>
                <Label htmlFor="api-method">API Method</Label>
                <Select onValueChange={v => setMethod(v as APIMethods)}>
                    <SelectTrigger className="w-[180px]" id="api-method">
                        <SelectValue placeholder="Select your method" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {APIMethods.map(method => (
                                <SelectItem key={method} value={method}>
                                    {method}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="api-url">API Route</Label>
                <Input
                    ref={urlRef}
                    id="api-url"
                    type="text"
                    placeholder="https://webie.dev/api/some-thing"
                />
            </div>
            {method !== 'GET' && (
                <div>
                    <Label htmlFor="api-body">API Body</Label>
                    <Textarea
                        ref={bodyRef}
                        id="api-body"
                        placeholder={`{\n    input: someting,\n    in_your: body\n}`}
                        rows={8}
                    />
                </div>
            )}
            <div>
                <Label htmlFor="api-response">API Response</Label>
                <Textarea
                    readOnly
                    ref={bodyRef}
                    id="api-response"
                    placeholder={`Press the "Test API" button below. The response will be shown here`}
                    value={response}
                    rows={8}
                />
            </div>

            <Button onClick={() => method && testAPI(method)} size={'sm'}>
                Test API
            </Button>
        </div>
    )
}
