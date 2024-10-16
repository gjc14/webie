import { useState } from 'react'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { cn } from '~/lib/utils'
import { longTextTypeMetaSchema } from '../../../../schema/column/type-meta'
import { TypeLogicProps } from './type'
import { WebieTypeSettingErrorConstructor } from './type-meta-error-constructor'

export const LongTextSettingCard = ({
    colDefEditing,
    setColDefEditing,
    className,
}: TypeLogicProps) => {
    const [errors, setErrors] = useState<string[]>([])
    const {
        success,
        error,
        data: typeMeta,
    } = longTextTypeMetaSchema.safeParse(colDefEditing.typeMeta)
    if (!success) {
        console.error('Invalid type meta:', error)
    }

    return (
        <div className={cn('space-y-2', className)}>
            {success ? (
                <div>
                    <Label htmlFor="default-value">Default value</Label>
                    <Textarea
                        id="default-value"
                        rows={8}
                        placeholder={'Define default value for rows'}
                        defaultValue={typeMeta?.defaultValue ?? undefined}
                        onChange={e => {
                            const updatedTypeMeta = {
                                ...typeMeta,
                                defaultValue: e.target.value,
                            }

                            const validated =
                                longTextTypeMetaSchema.safeParse(
                                    updatedTypeMeta
                                )
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
            ) : (
                <WebieTypeSettingErrorConstructor />
            )}
        </div>
    )
}
