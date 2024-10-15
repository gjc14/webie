import { cn } from '~/lib/utils'
import { ipTypeMetaSchema } from '../../../../schema/column/type-meta'
import { DefaultValueInput } from './default-value-input'
import { TypeLogicProps } from './type'
import { WebieTypeSettingErrorConstructor } from './type-meta-error-constructor'

export const IpSettingCard = ({
    colDefEditing,
    setColDefEditing,
    className,
}: TypeLogicProps) => {
    const {
        success,
        error,
        data: typeMeta,
    } = ipTypeMetaSchema.safeParse(colDefEditing.typeMeta)
    if (!success) {
        console.error('Invalid type meta:', error)
    }

    return (
        <div className={cn('space-y-2', className)}>
            {success ? (
                <DefaultValueInput
                    type="text"
                    typeMetaData={typeMeta}
                    zodSchema={ipTypeMetaSchema}
                    colDefEditing={colDefEditing}
                    setColDefEditing={setColDefEditing}
                />
            ) : (
                <WebieTypeSettingErrorConstructor />
            )}
        </div>
    )
}
