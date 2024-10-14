import { forwardRef } from 'react'
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
        return (
            <div className={divClassName}>
                <Label htmlFor="default-value">Default value</Label>
                <Input
                    ref={ref}
                    id="default-value"
                    type={type}
                    placeholder={
                        props.placeholder || 'Define a default value for row'
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
                            console.error('Invalid type meta:', validated.error)
                            return
                        } else {
                            setColDefEditing({
                                ...colDefEditing,
                                typeMeta: validated.data,
                            })
                        }
                    }}
                />
            </div>
        )
    }
)
