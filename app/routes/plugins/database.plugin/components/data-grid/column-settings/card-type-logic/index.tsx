import { ColumnSettingsCardState } from '..'
import { SettingSectionWrapper } from '../setting-section'

// All supported column types
import { APISettingCard } from './api'

export const TypeLogicSettingCard = (props: ColumnSettingsCardState) => {
    switch (props.colDefStateInPopover.type) {
        case 'api': {
            return (
                <SettingSectionWrapper
                    title="API URL"
                    description="API URL is used to fetch data for this column. The data will
                    be fetched when the table is loaded or button clicked."
                >
                    <APISettingCard {...props} />
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
