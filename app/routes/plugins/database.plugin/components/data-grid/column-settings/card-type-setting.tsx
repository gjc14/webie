import { useEffect, useRef, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { supportedTypes } from '../../../components/table/type-selector'
import { useTable } from '../../../lib/hooks/table'
import { ColumnTypePopover } from '../../table/tool-bar/column-type-popover'
import { SettingSectionWrapper } from './setting-section'

export const TypeSettingCard = () => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [buttonWidth, setButtonWidth] = useState(0)
    const { colDefEditing } = useTable()

    useEffect(() => {
        if (buttonRef.current) {
            setButtonWidth(buttonRef.current.offsetWidth)
        }
    }, [buttonRef.current])

    // Get column type
    const columnType = supportedTypes.find(
        type => type.value === colDefEditing?.type
    )

    if (!colDefEditing) {
        console.error('Type setting card is called but column not specified')
        return null
    }

    return (
        <SettingSectionWrapper
            title="Type settings"
            description="Here you could chose the type of your column and its
                    respective type settings."
        >
            <ColumnTypePopover side="bottom" popOverWidth={buttonWidth}>
                <Button
                    ref={buttonRef}
                    id={'type-select'}
                    variant={'outline'}
                    className="w-full justify-start"
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
            </ColumnTypePopover>
        </SettingSectionWrapper>
    )
}
