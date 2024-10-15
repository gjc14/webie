import { cn } from '~/lib/utils'
import { stringTypeMetaSchema } from '../../../../schema/column/type-meta'
import { DefaultValueInput } from './default-value-input'
import { TypeLogicProps } from './type'
import { WebieTypeSettingErrorConstructor } from './type-meta-error-constructor'

export const EmailSettingCard = ({
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
                    type="email"
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
