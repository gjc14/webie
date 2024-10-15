import { Checkbox } from '~/components/ui/checkbox'
import { cn } from '~/lib/utils'
import { booleanTypeMetaSchema } from '../../../../schema/column/type-meta'
import { TypeLogicProps } from './type'
import { WebieTypeSettingErrorConstructor } from './type-meta-error-constructor'

export const BooleanSettingCard = ({
    colDefEditing,
    setColDefEditing,
    className,
}: TypeLogicProps) => {
    const {
        success,
        error,
        data: typeMeta,
    } = booleanTypeMetaSchema.safeParse(colDefEditing.typeMeta)
    if (!success) {
        console.error('Invalid type meta:', error)
    }

    return (
        <div className={cn('space-y-2', className)}>
            {success ? (
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="default-value"
                        defaultChecked={typeMeta.defaultValue}
                        onCheckedChange={v => {
                            setColDefEditing({
                                ...colDefEditing,
                                typeMeta: {
                                    ...typeMeta,
                                    defaultValue: v,
                                },
                            })
                        }}
                    />
                    <label
                        htmlFor="default-value"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Default checked
                    </label>
                </div>
            ) : (
                <WebieTypeSettingErrorConstructor />
            )}
        </div>
    )
}
