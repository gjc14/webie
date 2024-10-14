/**
 * Column settings popover.
 * The components uses the "colDefEditing".
 * Eventually save changes to "ColDef".
 */
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import SeparatorWithText from '~/routes/plugins/components/separator-with-text'
import { Action, TableState, useTable } from '../../../lib/hooks/table'
import { DangerZoneCard } from './card-danger-zone'
import { TypeLogicSettingCard } from './card-type-logic'
import { TypeSettingCard } from './card-type-setting'

export type ColumnSettingsCardState = {
    colDefEditing: NonNullable<TableState['colDefEditing']>
    setColDefEditing: Action['setColDefEditing']
}

export const ColumnSettings = ({ onFinished }: { onFinished?: () => void }) => {
    const { colDefEditing, setColDefEditing, setColDef } = useTable()

    if (!colDefEditing) {
        return null
    }

    const props = { colDefEditing, setColDefEditing }

    const handleSaveClick = () => {
        setColDef(colDefEditing)
        onFinished?.()
    }

    return (
        <div className="mx-1.5 my-1 space-y-3">
            <div>
                <Label htmlFor="col-name">Column Name</Label>
                <Input
                    id="col-name"
                    value={colDefEditing.headerName}
                    onChange={e =>
                        setColDefEditing({
                            ...colDefEditing,
                            headerName: e.target.value,
                        })
                    }
                    className="font-semibold text-sm md:text-base"
                />
            </div>

            <div className="my-3 space-y-3">
                <TypeSettingCard {...props} />

                <SeparatorWithText className="text-muted-foreground">
                    LOGIC SETTING
                </SeparatorWithText>

                <TypeLogicSettingCard {...props} />
            </div>

            <div className="pt-6 pb-8 space-y-5">
                <Separator className="bg-muted-foreground" />
                <Button className="w-full" onClick={handleSaveClick}>
                    Save
                </Button>
            </div>

            <div>
                <SeparatorWithText className="text-destructive dark:text-primary">
                    <span className="text-destructive dark:text-primary">
                        DANGER ZONE
                    </span>
                </SeparatorWithText>
                <DangerZoneCard />
            </div>
        </div>
    )
}
