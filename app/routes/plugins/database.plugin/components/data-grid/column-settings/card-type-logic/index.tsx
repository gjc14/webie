import { useTable } from '../../../../lib/hooks/table'

// All supported column types
import { SettingSectionWrapper } from '../setting-section'
import { APISettingCard } from './api'

export const TypeLogicSettingCard = () => {
    const { colDefEditing } = useTable()

    if (!colDefEditing) {
        console.error(
            'Type logic setting card is called but column not specified'
        )
        return null
    }

    switch (colDefEditing.type) {
        case 'api': {
            return (
                <SettingSectionWrapper
                    title="API URL"
                    description="API URL is used to fetch data for this column. The data will
                    be fetched when the table is loaded or button clicked."
                >
                    <APISettingCard />
                </SettingSectionWrapper>
            )
        }
        default: {
            return (
                <SettingSectionWrapper
                    title="Not implemented"
                    description="We are still developing this column type, if you have any IDEA, welcome to contact via contact@webie.dev"
                />
            )
        }
    }
}
