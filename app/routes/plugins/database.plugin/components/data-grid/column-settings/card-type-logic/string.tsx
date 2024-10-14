import { cn } from '~/lib/utils'
import { DefaultValueInput } from './default-value-input'
import { WebieTypeSettingErrorConstructor } from './type-meta-error-constructor'
import { stringTypeMetaSchema, TypeLogicProps } from './type'

export const StringSettingCard = ({
    colDefEditing,
    setColDefEditing,
    className,
}: TypeLogicProps) => {
    const {
        success,
        error,
        data: typeMeta,
    } = stringTypeMetaSchema.safeParse(colDefEditing.typeMeta)
    if (!success) {
        console.error('Invalid type meta:', error)
    }

    return (
        <div className={cn('space-y-2', className)}>
            {success ? (
                <DefaultValueInput
                    type="text"
                    typeMetaData={typeMeta}
                    zodSchema={stringTypeMetaSchema}
                    colDefEditing={colDefEditing}
                    setColDefEditing={setColDefEditing}
                />
            ) : (
                <WebieTypeSettingErrorConstructor />
            )}
        </div>
    )
}
