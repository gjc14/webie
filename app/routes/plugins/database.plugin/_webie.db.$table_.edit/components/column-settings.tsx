import { useEffect } from 'react'

import { Button } from '~/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '~/components/ui/card'
import { SetColumnPopover } from '../../components/table/tool-bar/set-column'
import { supportedTypes } from '../../components/table/type-selector'
import { useTable } from '../../lib/hooks/table'
import { ColumnSettingAlert } from './column-setting-alert'
import { APISettingCard } from './type-setting-cards/api'

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

    const ColumnLogicSetting = () => {
        switch (columnSelected.type) {
            case 'api': {
                return <APISettingCard />
            }
            default: {
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Not implemented</CardTitle>
                        </CardHeader>
                    </Card>
                )
            }
        }
    }

    return (
        <Card className="absolute bottom-0 left-0 z-10 w-full h-[75vh] p-3 border border-border rounded-2xl overflow-scroll sm:p-6 md:p-9">
            <CardHeader>
                <CardTitle>Setting {columnSelected.headerName}</CardTitle>
                <CardDescription>
                    Delete your column will also remove all respective data in
                    the row. Please make sure you have a backup.
                </CardDescription>
            </CardHeader>

            <CardContent className="my-3 space-y-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Type settings</CardTitle>
                        <CardDescription></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SetColumnPopover side="bottom">
                            <Button
                                variant={'outline'}
                                className="w-52 justify-start"
                            >
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
                    </CardContent>
                </Card>
                <ColumnLogicSetting />
            </CardContent>

            <CardFooter>
                <Card className="w-full border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive font-black">
                            Danger zone
                        </CardTitle>
                        <CardDescription>
                            Delete your column will also remove all respective
                            data in the row. Please make sure you have a backup.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <ColumnSettingAlert
                            promptTitle="Delete column"
                            promptMessage="Delete your column will also remove all respective
                            data in the row. Please make sure you have a backup."
                            executeMessage="Delete"
                            execute={() => {}}
                        >
                            <Button variant="destructive">Delete column</Button>
                        </ColumnSettingAlert>
                    </CardFooter>
                </Card>
            </CardFooter>
        </Card>
    )
}
