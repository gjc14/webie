import { Card, CardHeader, CardTitle } from '~/components/ui/card'
import { useTable } from '../../../../lib/hooks/table'

// All supported column types
import { APISettingCard } from './api'

export const TypeLogicSettingCard = () => {
    const { columnSelected } = useTable()

    if (!columnSelected) return null

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
