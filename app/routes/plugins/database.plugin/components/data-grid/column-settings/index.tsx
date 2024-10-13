/**
 * Column settings popover.
 * The components share the same state.
 * Eventually save changes to the zustand main state on this main component.
 */
import { useEffect, useState } from 'react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import SeparatorWithText from '~/routes/plugins/components/separator-with-text'
import { useTable } from '../../../lib/hooks/table'
import { webieColDef } from '../../../schema/table'
import { DangerZoneCard } from './card-danger-zone'
import { TypeLogicSettingCard } from './card-type-logic'
import { TypeSettingCard } from './card-type-setting'

export type ColumnSettingsCardState = {
    colDefStateInPopover: webieColDef
    setColDefStateInPopover: React.Dispatch<
        React.SetStateAction<webieColDef | undefined>
    >
}

export const ColumnSettings = ({ onSave }: { onSave?: () => void }) => {
    const { colDefEditing, setColDef } = useTable()
    const [colDefStateInPopover, setColDefStateInPopover] =
        useState<webieColDef>()

    useEffect(() => {
        colDefEditing && setColDefStateInPopover(colDefEditing)
    }, [colDefEditing])

    if (!colDefEditing || !colDefStateInPopover) {
        return null
    }

    const props = { colDefStateInPopover, setColDefStateInPopover }

    const handleSaveClick = () => {
        onSave?.()
        setColDef(colDefStateInPopover)
    }

    return (
        <div className="mx-1.5 my-1 space-y-3">
            <div>
                <Label htmlFor="col-name">Column Name</Label>
                <Input
                    id="col-name"
                    value={colDefStateInPopover.headerName}
                    onChange={e =>
                        setColDefStateInPopover({
                            ...colDefStateInPopover,
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
