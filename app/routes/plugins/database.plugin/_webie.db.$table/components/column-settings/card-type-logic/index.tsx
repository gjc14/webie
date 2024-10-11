import { Card, CardHeader, CardTitle } from '~/components/ui/card'
import { useTable } from '../../../../lib/hooks/table'

// All supported column types
import { APISettingCard } from './api'

export const TypeLogicSettingCard = () => {
    const { settingSelectedColumn } = useTable()

    if (!settingSelectedColumn) return null

    switch (settingSelectedColumn.type) {
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
