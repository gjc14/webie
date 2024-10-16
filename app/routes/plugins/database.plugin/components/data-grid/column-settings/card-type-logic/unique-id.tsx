import { Label } from '~/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'
import { cn } from '~/lib/utils'
import { isIdType } from '~/routes/plugins/database.plugin/lib/utils'
import { idTypeMetaSchema, idTypes } from '../../../../schema/column/type-meta'
import { TypeLogicProps } from './type'
import { WebieTypeSettingErrorConstructor } from './type-meta-error-constructor'

export const UniqueIdSettingCard = ({
    colDefEditing,
    setColDefEditing,
    className,
}: TypeLogicProps) => {
    const {
        success,
        error,
        data: typeMeta,
    } = idTypeMetaSchema.safeParse(colDefEditing.typeMeta)
    if (!success) {
        console.error('Invalid type meta:', error)
    }

    return (
        <div className={cn('space-y-2', className)}>
            {success ? (
                <>
                    <div>
                        <Label htmlFor="id-type">ID Type</Label>
                        <Select
                            onValueChange={v => {
                                if (!isIdType(v)) return

                                const newTypeMeta: typeof typeMeta = {
                                    ...typeMeta,
                                    idType: v,
                                }
                                setColDefEditing({
                                    ...colDefEditing,
                                    typeMeta: newTypeMeta,
                                })
                            }}
                            defaultValue={typeMeta?.idType}
                        >
                            <SelectTrigger className="w-full" id="id-type">
                                <SelectValue placeholder="Select default status" />
                            </SelectTrigger>
                            <SelectContent>
                                {idTypes.map(option => {
                                    return (
                                        <SelectItem key={option} value={option}>
                                            {option.toUpperCase()}
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                        <p className="px-1 py-0.5 text-xs text-muted-foreground">
                            Webie do have an unique id for identyfying all rows,
                            this will be an additional identifyer. NanoId
                            generates most efficient of all methods, where as
                            UUID is more complex and secure but takes up more
                            storage, and CUID offers a balance between.
                        </p>
                    </div>
                </>
            ) : (
                <WebieTypeSettingErrorConstructor />
            )}
        </div>
    )
}
