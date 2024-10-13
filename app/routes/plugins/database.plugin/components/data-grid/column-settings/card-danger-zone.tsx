import { Button } from '~/components/ui/button'
import { useTable } from '../../../lib/hooks/table'
import { ColumnSettingAlert } from './column-setting-alert'
import { SettingSectionWrapper } from './setting-section'

export const DangerZoneCard = () => {
    const { colDefEditing, deleteColumn } = useTable()

    if (!colDefEditing) {
        console.error('Danger zone card is called but column not specified')
        return null
    }

    return (
        <SettingSectionWrapper
            title="Danger zone"
            description="Delete your column will also remove all respective data in
                    the row. Please make sure you have a backup."
            titleClassName="text-destructive"
        >
            <ColumnSettingAlert
                promptTitle={`Delete column ${colDefEditing.headerName}`}
                promptMessage="Delete your column will also remove all respective
                            data in the row. Please make sure you have a backup."
                executeMessage={`Delete ${colDefEditing.headerName}`}
                execute={() => deleteColumn(colDefEditing)}
            >
                <Button variant="destructive" size={'sm'}>
                    Delete column
                </Button>
            </ColumnSettingAlert>
        </SettingSectionWrapper>
    )
}
