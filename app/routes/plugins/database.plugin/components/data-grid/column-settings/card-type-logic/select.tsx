import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { cn } from '~/lib/utils'
import { selectTypeMetaSchema, TypeLogicProps } from './type'
import { WebieTypeSettingErrorConstructor } from './type-meta-error-constructor'

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
        <div className={cn('', className)}>
            <Label htmlFor="option-input">Select options</Label>
            {success ? (
                <Textarea
                    id="option-input"
                    value={typeMeta.options}
                    onChange={e => {
                        setColDefEditing({
                            ...colDefEditing,
                            typeMeta: { ...typeMeta, options: e.target.value },
                        })
                    }}
                    placeholder="Enter options separated by new line"
                    rows={5}
                />
            ) : (
                <WebieTypeSettingErrorConstructor />
            )}
        </div>
    )
}
