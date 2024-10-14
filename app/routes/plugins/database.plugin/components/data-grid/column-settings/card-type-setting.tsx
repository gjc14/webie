import { useEffect, useRef, useState } from 'react'
import { Button } from '~/components/ui/button'
import { ColumnSettingsCardState } from '.'
import { supportedTypes } from '../../../components/table/type-selector'
import { webieColDef, webieColType } from '../../../schema/table'
import { ColumnTypePopover } from '../../table/tool-bar/column-type-popover'
import { SettingSectionWrapper } from './setting-section'
import { typeDefaultColumnMetaValueMap } from './card-type-logic/type'

export const TypeSettingCard = ({
    colDefEditing,
    setColDefEditing,
}: ColumnSettingsCardState) => {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [buttonWidth, setButtonWidth] = useState(0)

    useEffect(() => {
        if (buttonRef.current) {
            setButtonWidth(buttonRef.current.offsetWidth)
        }
    }, [buttonRef.current])

    // Get column type
    const columnType = supportedTypes.find(
        type => type.value === colDefEditing.type
    )

    const onTypeSelect = (typeSelected: webieColType) => {
        const defaultTypeColumnMetaValue =
            typeDefaultColumnMetaValueMap[typeSelected]
        const newColDef: webieColDef = {
            ...colDefEditing,
            type: typeSelected,
            typeMeta: defaultTypeColumnMetaValue,
        }
        setColDefEditing(newColDef)
    }

    return (
        <SettingSectionWrapper
            title="Type settings"
            description="Here you could chose the type of your column and its
                    respective type settings."
        >
            <ColumnTypePopover
                side="bottom"
                popOverWidth={buttonWidth}
                onTypeSelect={type => onTypeSelect(type)}
            >
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
