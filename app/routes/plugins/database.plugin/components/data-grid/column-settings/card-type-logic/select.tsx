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
import { selectTypeMetaSchema } from '../../../../schema/column'
import { TypeLogicProps } from './type'
import { WebieTypeSettingErrorConstructor } from './type-meta-error-constructor'
import { Checkbox } from '~/components/ui/checkbox'

export const SelectSettingCard = ({
    colDefEditing,
    setColDefEditing,
    className,
}: TypeLogicProps) => {
    const {
        success,
        error,
        data: typeMeta,
    } = selectTypeMetaSchema.safeParse(colDefEditing.typeMeta)
    if (!success) {
        console.error('Invalid type meta:', error)
    }

    return (
        <div className={cn('space-y-2', className)}>
            {success ? (
                <>
                    <div>
                        <Label htmlFor="default-value">Default select</Label>
                        <Select
                            onValueChange={v => {
                                setColDefEditing({
                                    ...colDefEditing,
                                    typeMeta: {
                                        ...typeMeta,
                                        defaultValue: v,
                                    },
                                })
                            }}
                            defaultValue={typeMeta?.defaultValue}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select default status" />
                            </SelectTrigger>
                            <SelectContent>
                                {typeMeta?.options.split('\n').map(option => {
                                    if (option.trim() === '')
                                        return (
                                            <p
                                                key="default-value"
                                                className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                            >
                                                Please add an option
                                            </p>
                                        )
                                    return (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="option-input">Select options</Label>
                        <Textarea
                            id="option-input"
                            value={typeMeta.options}
                            onChange={e => {
                                setColDefEditing({
                                    ...colDefEditing,
                                    typeMeta: {
                                        ...typeMeta,
                                        options: e.target.value,
                                    },
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
                                setColDefEditing({
                                    ...colDefEditing,
                                    typeMeta: {
                                        ...typeMeta,
                                        allowNewItemInCell: v,
                                    },
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
