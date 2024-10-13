import { Input } from '~/components/ui/input'
import SeparatorWithText from '~/routes/plugins/components/separator-with-text'
import { useTable } from '../../../lib/hooks/table'
import { DangerZoneCard } from './card-danger-zone'
import { TypeLogicSettingCard } from './card-type-logic'
import { TypeSettingCard } from './card-type-setting'

export const ColumnSettings = () => {
    const { colDefEditing } = useTable()

    if (!colDefEditing) {
        console.error('Column settings is called but column not specified')
        return null
    }

    return (
        <div className="mx-1.5 my-1 space-y-3">
            <div>
                <Input
                    defaultValue={colDefEditing.headerName}
                    className="font-semibold text-sm md:text-base"
                />
            </div>

            <div className="my-3 space-y-3">
                <TypeSettingCard />

                <SeparatorWithText className="text-muted-foreground">
                    LOGIC SETTING
                </SeparatorWithText>

                <TypeLogicSettingCard />
            </div>

            <div>
                <SeparatorWithText className="text-destructive">
                    <span className="text-destructive">DANGER ZONE</span>
                </SeparatorWithText>
                <DangerZoneCard />
            </div>
        </div>
    )
}
