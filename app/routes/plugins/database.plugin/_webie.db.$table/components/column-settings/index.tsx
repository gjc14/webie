import { useEffect } from 'react'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '~/components/ui/card'
import { useTable } from '../../../lib/hooks/table'
import { DangerZoneCard } from './card-danger-zone'
import { TypeSettingCard } from './card-type-setting'
import { TypeLogicSettingCard } from './card-type-logic'

export const ColumnSettings = () => {
    const {
        settingSelectedColumn,
        setSettingSelectedColumn,
        tableConfigState,
    } = useTable()

    // Set default column selected
    useEffect(() => {
        if (!settingSelectedColumn && tableConfigState.columns.length > 0) {
            setSettingSelectedColumn(tableConfigState.columns[0]._id)
        }
    }, [])

    if (!settingSelectedColumn) return null

    return (
        <Card className="absolute bottom-0 left-0 z-10 w-full h-[75vh] p-3 border border-border rounded-2xl overflow-scroll sm:p-6 md:p-9">
            <CardHeader>
                <CardTitle>
                    Setting {settingSelectedColumn.headerName}
                </CardTitle>
                <CardDescription>
                    Delete your column will also remove all respective data in
                    the row. Please make sure you have a backup.
                </CardDescription>
            </CardHeader>

            <CardContent className="my-3 space-y-2">
                <TypeSettingCard />
                <TypeLogicSettingCard />
            </CardContent>

            <CardFooter>
                <DangerZoneCard />
            </CardFooter>
        </Card>
    )
}
