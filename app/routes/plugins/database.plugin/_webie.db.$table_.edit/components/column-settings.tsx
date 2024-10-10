import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { SetColumnPopover } from '../../components/table/tool-bar/set-column'
import { supportedTypes } from '../../components/table/type-selector'
import { webieColType } from '../../schema/table'

export const ColumnSettings = ({ type }: { type: webieColType }) => {
    const [typeState, setTypeState] = useState<webieColType>(type)

    const columnType = supportedTypes.find(type => type.value === typeState)

    return (
        <div className="absolute bottom-0 left-0 z-10 w-full h-[60vh] p-3 bg-zinc-100 dark:bg-zinc-800 border border-border rounded-2xl sm:p-6 md:p-9">
            <h2>Column settings</h2>
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
    )
}
