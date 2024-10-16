import { cn } from '~/lib/utils'
import { jsonTypeMetaSchema } from '../../../../schema/column/type-meta'
import { DefaultValueTextArea } from './default-value-textarea'
import { TypeLogicProps } from './type'
import { WebieTypeSettingErrorConstructor } from './type-meta-error-constructor'

export const JsonSettingCard = ({
    colDefEditing,
    setColDefEditing,
    className,
}: TypeLogicProps) => {
    const {
        success,
        error,
        data: typeMeta,
    } = jsonTypeMetaSchema.safeParse(colDefEditing.typeMeta)
    if (!success) {
        console.error('Invalid type meta:', error)
    }

    return (
        <div className={cn('space-y-2', className)}>
            {success ? (
                <DefaultValueTextArea
                    typeMetaData={typeMeta}
                    zodSchema={jsonTypeMetaSchema}
                    colDefEditing={colDefEditing}
                    setColDefEditing={setColDefEditing}
                />
            ) : (
                <WebieTypeSettingErrorConstructor />
            )}
        </div>
    )
}
