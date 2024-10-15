import { Label } from '~/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'
import { cn } from '~/lib/utils'
import {
    numberTypeMetaSchema,
    numberTypes,
} from '../../../../schema/column/type-meta'
import { DefaultValueInput } from './default-value-input'
import { TypeLogicProps } from './type'
import { WebieTypeSettingErrorConstructor } from './type-meta-error-constructor'

export const NumberSettingCard = ({
    colDefEditing,
    setColDefEditing,
    className,
}: TypeLogicProps) => {
    const {
        success,
        error,
        data: typeMeta,
    } = numberTypeMetaSchema.safeParse(colDefEditing.typeMeta)
    if (!success) {
        console.error('Invalid type meta:', error)
    }

    return (
        <div className={cn('space-y-2', className)}>
            {success ? (
                <>
                    <div>
                        <Label htmlFor="number-type">Type (Coming soon)</Label>
                        <Select
                            onValueChange={v => {
                                setColDefEditing({
                                    ...colDefEditing,
                                    typeMeta: {
                                        ...typeMeta,
                                        type: v,
                                    },
                                })
                            }}
                            defaultValue={typeMeta?.type ?? 'none'}
                        >
                            <SelectTrigger className="w-full" id="number-type">
                                <SelectValue placeholder="Select default status" />
                            </SelectTrigger>
                            <SelectContent>
                                {numberTypes.map(option => {
                                    return (
                                        <SelectItem key={option} value={option}>
                                            {option.charAt(0).toUpperCase() +
                                                option.slice(1).toLowerCase()}
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                        {/* TODO: Implement functionality number types */}
                    </div>
                    <div>
                        <DefaultValueInput
                            type="number"
                            typeMetaData={typeMeta}
                            zodSchema={numberTypeMetaSchema}
                            colDefEditing={colDefEditing}
                            setColDefEditing={setColDefEditing}
                        />
                    </div>
                </>
            ) : (
                <WebieTypeSettingErrorConstructor />
            )}
        </div>
    )
}
