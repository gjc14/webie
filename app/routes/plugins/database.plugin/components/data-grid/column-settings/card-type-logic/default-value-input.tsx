import { forwardRef, useState } from 'react'
import { ZodType } from 'zod'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
    Action,
    TableState,
} from '~/routes/plugins/database.plugin/lib/hooks/table'

export interface DefaultColumnTypeMetaValueInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    typeMetaData: {
        defaultValue?: any
        [key: string]: any
    }
    zodSchema: ZodType
    colDefEditing: NonNullable<TableState['colDefEditing']>
    setColDefEditing: Action['setColDefEditing']
    divClassName?: string
}

export const DefaultValueInput = forwardRef<
    HTMLInputElement,
    DefaultColumnTypeMetaValueInputProps
>(
    (
        {
            className,
            type,
            typeMetaData,
            zodSchema,
            colDefEditing,
            setColDefEditing,
            divClassName,
            ...props
        },
        ref
    ) => {
        const [errors, setErrors] = useState<string[]>([])

        return (
            <div className={divClassName}>
                <Label htmlFor="default-value">Default value</Label>
                <Input
                    ref={ref}
                    id="default-value"
                    type={type}
                    placeholder={
                        props.placeholder || 'Define default value for rows'
                    }
                    defaultValue={typeMetaData?.defaultValue}
                    onChange={e => {
                        const updatedTypeMeta = {
                            ...typeMetaData,
                            defaultValue:
                                type === 'number'
                                    ? Number(e.target.value)
                                    : e.target.value,
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
                />
                {errors.length > 0 && (
                    <p className="mt-1.5 px-1.5 py-0.5 bg-destructive rounded-md text-sm">
                        Error! {errors.join(', ')}
                    </p>
                )}
            </div>
        )
    }
)
