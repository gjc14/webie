import { useEffect } from 'react'

import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { SetColumnPopover } from '../../components/table/tool-bar/set-column'
import { supportedTypes } from '../../components/table/type-selector'
import { useTable } from '../../lib/hooks/table'

export const ColumnSettings = () => {
    const { columnSelected, setColumnSelected, tableConfigState } = useTable()

    useEffect(() => {
        if (!columnSelected && tableConfigState.columns.length > 0) {
            setColumnSelected(tableConfigState.columns[0]._id)
        }
    }, [])

    const columnType = supportedTypes.find(
        type => type.value === columnSelected?.type
    )

    if (!columnSelected) return null

    return (
        <div className="absolute bottom-0 left-0 z-10 w-full h-[60vh] p-3 space-y-2 bg-zinc-100 dark:bg-zinc-800 border border-border rounded-2xl sm:p-6 md:p-9">
            <div>
                <h2>Setting {columnSelected.headerName}</h2>
            </div>

            <div>
                <Label>Column type</Label>
                <SetColumnPopover side="bottom">
                    <Button className="w-52 justify-start">
                        {columnType ? (
                            <>
                                <columnType.icon
                                    size={16}
                                    className="mr-2 opacity-100"
                                />
                                {columnType?.label}
                            </>
                        ) : (
                            'No type defined'
                        )}
                    </Button>
                </SetColumnPopover>
            </div>
        </div>
    )
}
