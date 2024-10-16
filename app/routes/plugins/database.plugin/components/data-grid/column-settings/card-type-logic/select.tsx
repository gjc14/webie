import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu'
import { MultiSelect } from '~/components/multi-select'
import { Checkbox } from '~/components/ui/checkbox'
import { Label } from '~/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { cn } from '~/lib/utils'
import { selectTypeMetaSchema } from '../../../../schema/column/type-meta'
import { TypeLogicProps } from './type'
import { WebieTypeSettingErrorConstructor } from './type-meta-error-constructor'

type Checked = DropdownMenuCheckboxItemProps['checked']

interface SelectSettingCardProps extends TypeLogicProps {
    multiple?: boolean
}

export const SelectSettingCard = ({
    colDefEditing,
    setColDefEditing,
    className,
    multiple,
}: SelectSettingCardProps) => {
    const {
        success,
        error,
        data: typeMeta,
    } = selectTypeMetaSchema.safeParse(colDefEditing.typeMeta)
    if (!success) {
        console.error('Invalid type meta:', error)
    }

    const noOptionMsg = 'Please add an option'

    const options =
        typeMeta?.options.length && typeMeta.options.length > 0
            ? typeMeta.options.split('\n').map(option => {
                  return {
                      label: option,
                      value: option,
                  }
              })
            : []

    return (
        <div className={cn('space-y-2', className)}>
            {success ? (
                <>
                    <div>
                        <Label htmlFor="default-select">Default select</Label>
                        {!multiple ? (
                            <Select
                                onValueChange={v => {
                                    const newTypeMeta: typeof typeMeta = {
                                        ...typeMeta,
                                        defaultValue: v,
                                    }
                                    setColDefEditing({
                                        ...colDefEditing,
                                        typeMeta: newTypeMeta,
                                    })
                                }}
                                defaultValue={typeMeta?.defaultValue}
                            >
                                <SelectTrigger
                                    className="w-full"
                                    id="default-select"
                                >
                                    <SelectValue placeholder="Define a default option" />
                                </SelectTrigger>
                                <SelectContent>
                                    {typeMeta.options
                                        .split('\n')
                                        .map(option => {
                                            if (option.trim() === '')
                                                return (
                                                    <p
                                                        key="no-options"
                                                        className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                    >
                                                        {noOptionMsg}
                                                    </p>
                                                )
                                            return (
                                                <SelectItem
                                                    key={option}
                                                    value={option}
                                                >
                                                    {option}
                                                </SelectItem>
                                            )
                                        })}
                                </SelectContent>
                            </Select>
                        ) : (
                            <MultiSelect
                                defaultSelected={
                                    // From database, formatted "op1, op2, op3"
                                    typeMeta.defaultValue
                                        ? typeMeta.defaultValue
                                              .split(', ')
                                              .map(v => {
                                                  return {
                                                      label: v,
                                                      value: v,
                                                  }
                                              })
                                        : undefined
                                }
                                placeholder="Define default options"
                                options={options}
                                onSelectedChange={v => {
                                    // To database, formatted "op1, op2, op3"
                                    const formattedValue = v
                                        .map(v => v.value)
                                        .join(', ')

                                    const newTypeMeta: typeof typeMeta = {
                                        ...typeMeta,
                                        defaultValue: formattedValue,
                                    }
                                    setColDefEditing({
                                        ...colDefEditing,
                                        typeMeta: newTypeMeta,
                                    })
                                }}
                            />
                        )}
                    </div>

                    <div>
                        <Label htmlFor="option-input">Select options</Label>
                        <Textarea
                            id="option-input"
                            value={typeMeta.options}
                            onChange={e => {
                                const newTypeMeta: typeof typeMeta = {
                                    ...typeMeta,
                                    options: e.target.value,
                                }
                                setColDefEditing({
                                    ...colDefEditing,
                                    typeMeta: newTypeMeta,
                                })
                            }}
                            placeholder="Enter options separated by new line"
                            rows={5}
                        />
                    </div>

                    <div className="flex items-center space-x-2 px-1 pt-2">
                        <Checkbox
                            id="default-value"
                            defaultChecked={typeMeta.allowNewOptions}
                            onCheckedChange={v => {
                                const newTypeMeta: typeof typeMeta = {
                                    ...typeMeta,
                                    allowNewOptions: !!v,
                                }
                                setColDefEditing({
                                    ...colDefEditing,
                                    typeMeta: newTypeMeta,
                                })
                            }}
                        />
                        <label
                            htmlFor="default-value"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Allow new item when selecting in cell
                        </label>
                    </div>
                </>
            ) : (
                <WebieTypeSettingErrorConstructor />
            )}
        </div>
    )
}
