import { useState } from 'react'
import { ZodType } from 'zod'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import {
    Action,
    TableState,
} from '~/routes/plugins/database.plugin/lib/hooks/table'

interface DefaultColumnTypeMetaValueInputProps {
    className?: string
    typeMetaData: {
        defaultValue?: any
        [key: string]: any
    }
    zodSchema: ZodType
    colDefEditing: NonNullable<TableState['colDefEditing']>
    setColDefEditing: Action['setColDefEditing']
    divClassName?: string
}

export const DefaultValueTextArea = ({
    typeMetaData,
    zodSchema,
    colDefEditing,
    className,
    setColDefEditing,
    divClassName,
}: DefaultColumnTypeMetaValueInputProps) => {
    const [errors, setErrors] = useState<string[]>([])
    return (
        <div className={divClassName}>
            <Label htmlFor="default-value">Default value</Label>
            <Textarea
                id="default-value"
                className={className}
                placeholder={'Define default value for rows'}
                defaultValue={typeMetaData?.defaultValue ?? undefined}
                onChange={e => {
                    const updatedTypeMeta = {
                        ...typeMetaData,
                        defaultValue: e.target.value,
                    }

                    const validated = zodSchema.safeParse(updatedTypeMeta)
                    if (!validated.success) {
                        const errors = validated.error.errors.map(
                            e => e.message
                        )
                        console.error('Invalid type meta:', errors)
                        setErrors(errors)
                        return
                    } else {
                        setErrors([])
                        setColDefEditing({
                            ...colDefEditing,
                            typeMeta: validated.data,
                        })
                    }
                }}
                rows={8}
            />
            {errors.length > 0 && (
                <p className="mt-1.5 px-1.5 py-0.5 bg-destructive rounded-md text-sm">
                    Error! {errors.join(', ')}
                </p>
            )}
        </div>
    )
}
