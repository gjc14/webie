import { ColumnSettingsCardState } from '..'
import { DbTypeBadge } from '../../../db-type-badge'
import { supportedTypes } from '../../../table/type-selector'
import { SettingSectionWrapper } from '../setting-section'

// All supported column types
import { APISettingCard } from './api'
import { EmailSettingCard } from './email'
import { NumberSettingCard } from './number'
import { SelectSettingCard } from './select'
import { StringSettingCard } from './string'

export const TypeLogicSettingCard = (props: ColumnSettingsCardState) => {
    const currentType = props.colDefEditing.type
    const title =
        supportedTypes.find(type => type.value === currentType)?.label ||
        currentType.charAt(0).toUpperCase() +
            currentType.slice(1).toLowerCase() +
            ' is not supported yet'

    switch (currentType) {
        case 'string': {
            return (
                <SettingSectionWrapper
                    title={title}
                    description={
                        <>
                            String is the most common type in the database. It
                            is used to store text data.{'\n'}
                            If your looking for multiple line text, use{' '}
                            <DbTypeBadge>Long text</DbTypeBadge> type.
                        </>
                    }
                >
                    <StringSettingCard {...props} />
                </SettingSectionWrapper>
            )
        }
        case 'number': {
            return (
                <SettingSectionWrapper
                    title={title}
                    description="Number is used to store numeric data. It could be integer or decimal."
                >
                    <NumberSettingCard {...props} />
                </SettingSectionWrapper>
            )
        }
        case 'boolean': {
            return (
                <SettingSectionWrapper
                    title={title}
                    description="Checkbox is used to store true or false value."
                >
                    {/* TODO: Customizable check icon */}
                </SettingSectionWrapper>
            )
        }
        case 'select': {
            return (
                <SettingSectionWrapper
                    title={title}
                    description="Select will provide values you provided. It is used to store predefined values."
                >
                    <SelectSettingCard {...props} />
                </SettingSectionWrapper>
            )
        }
        case 'multipleSelect': {
            return (
                <SettingSectionWrapper
                    title={title}
                    description="Multiple select is used to store multiple predefined values."
                >
                    <SelectSettingCard {...props} />
                </SettingSectionWrapper>
            )
        }
        case 'email': {
            return (
                <SettingSectionWrapper
                    title={title}
                    description="Email is used to store email address."
                >
                    <EmailSettingCard {...props} />
                </SettingSectionWrapper>
            )
        }
        case 'api': {
            return (
                <SettingSectionWrapper
                    title={title}
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
                    title={title + ' (Coming soon)'}
                    description="We are still developing this column type, if you have any IDEA, welcome to contact via contact@webie.dev"
                />
            )
        }
    }
}
