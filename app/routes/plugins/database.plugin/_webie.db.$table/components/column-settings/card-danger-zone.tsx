import { Button } from '~/components/ui/button'
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '~/components/ui/card'
import { useTable } from '../../../lib/hooks/table'
import { ColumnSettingAlert } from './column-setting-alert'

export const DangerZoneCard = () => {
    const { settingSelectedColumn, deleteColumn } = useTable()

    return (
        <Card className="w-full border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive font-bold">
                    Danger zone
                </CardTitle>
                <CardDescription>
                    Delete your column will also remove all respective data in
                    the row. Please make sure you have a backup.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <ColumnSettingAlert
                    promptTitle={`Delete column ${settingSelectedColumn?.headerName}`}
                    promptMessage="Delete your column will also remove all respective
                            data in the row. Please make sure you have a backup."
                    executeMessage={`Delete ${settingSelectedColumn?.headerName}`}
                    execute={() => {
                        settingSelectedColumn
                            ? deleteColumn(settingSelectedColumn)
                            : console.log('No column selected')
                    }}
                >
                    <Button variant="destructive">Delete column</Button>
                </ColumnSettingAlert>
            </CardFooter>
        </Card>
    )
}
