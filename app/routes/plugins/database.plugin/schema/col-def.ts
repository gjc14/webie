/**
 * Workflow:
 * -> Add a new function taking p and params
 * -> Write a zod schema for the function
 * -> Add the function to the union type
 * -> Update the switch case in getValueGetterFunc
 */
import { ValueGetterParams } from 'ag-grid-community'
import { z } from 'zod'
import { webieRowData } from './table'

////////////////////////////
// Value Getter Functions //
////////////////////////////
const sameAsColumn = (
    p: ValueGetterParams<webieRowData>,
    params: { columnId: string }
) => {
    return p.data?.[params.columnId]
}
const sameAsColumnSchema = z.object({
    func: z.literal('sameAsColumn'),
    params: z.object({
        columnId: z.string(),
    }),
})

const anotherFunc = (
    p: ValueGetterParams<webieRowData>,
    params: { someParam: number }
) => {
    return params.someParam + 10
}
const anotherFuncSchema = z.object({
    func: z.literal('anotherFunc'),
    params: z.object({
        someParam: z.number(),
    }),
})

///////////////////////////////////
/////          Summup         /////
///////////////////////////////////
const valueGetterSchema = z.union([sameAsColumnSchema, anotherFuncSchema])
type VGDefUnion = z.infer<typeof valueGetterSchema>

const getValueGetterFunc = (
    p: ValueGetterParams<webieRowData>,
    VGDefs: VGDefUnion
) => {
    switch (VGDefs.func) {
        case 'sameAsColumn':
            return sameAsColumn(p, VGDefs.params)
        case 'anotherFunc':
            return anotherFunc(p, VGDefs.params)
        default:
            break
    }
}

export { valueGetterSchema, getValueGetterFunc }
