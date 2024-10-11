import { Button } from '~/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '~/components/ui/card'
import { SetColumnPopover } from '../../../components/table/tool-bar/set-column'
import { supportedTypes } from '../../../components/table/type-selector'
import { useTable } from '../../../lib/hooks/table'

export const TypeSettingCard = () => {
    const { settingSelectedColumn } = useTable()

    // Get column type
    const columnType = supportedTypes.find(
        type => type.value === settingSelectedColumn?.type
    )

    return (
        <Card>
            <CardHeader>
                <CardTitle>Type settings</CardTitle>
                <CardDescription>
                    Here you could chose the type of your column and its
                    respective type settings.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SetColumnPopover side="bottom">
                    <Button variant={'outline'} className="w-52 justify-start">
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
    )
}
