import { z } from 'zod'
import {
    webieColType,
    zodTypeMap,
} from '~/routes/plugins/database.plugin/schema/table'

// String
export const stringTypeMetaSchema = z.object({
    defaultValue: zodTypeMap.string.optional(),
})
export type StringTypeMeta = z.infer<typeof stringTypeMetaSchema>
const defaultStringTypeMeta: StringTypeMeta = {
    defaultValue: undefined,
}

// Number
export const numberTypeMetaSchema = z.object({
    defaultValue: zodTypeMap.number.optional(),
})
export type NumberTypeMeta = z.infer<typeof numberTypeMetaSchema>
const defaultNumberTypeMeta: NumberTypeMeta = {
    defaultValue: undefined,
}

// Boolean
export const booleanTypeMetaSchema = z.object({
    defaultValue: zodTypeMap.boolean.optional(),
})
export type BooleanTypeMeta = z.infer<typeof booleanTypeMetaSchema>
const defaultBooleanTypeMeta: BooleanTypeMeta = {
    defaultValue: undefined,
}

// Select & Multiple Select
export const selectTypeMetaSchema = z.object({
    options: z.array(z.string()),
    defaultSelection: z.array(z.string()),
})
export type SelectTypeMeta = z.infer<typeof selectTypeMetaSchema>
const defaultSelectTypeMeta: SelectTypeMeta = {
    options: [],
    defaultSelection: [],
}

// Email
export const emailTypeMetaSchema = z.object({
    defaultValue: zodTypeMap.email.optional(),
})
export type EmailTypeMeta = z.infer<typeof emailTypeMetaSchema>
const defaultEmailTypeMeta: EmailTypeMeta = {
    defaultValue: undefined,
}

// API
export const APIMethods = ['GET', 'POST', 'PUT', 'DELETE'] as const
export const apiTypeMetaSchema = z.object({
    url: z.string(),
    method: z.enum(APIMethods),
    body: z.string(),
    header: z.record(z.string()),
})
export type ApiTypeMeta = z.infer<typeof apiTypeMetaSchema>
const defaultApiTypeMeta: ApiTypeMeta = {
    url: '',
    method: 'POST',
    body: '',
    header: {},
}

export const typeDefaultColumnMetaValueMap: {
    [type in webieColType]: undefined | Record<string, any>
} = {
    string: defaultStringTypeMeta,
    number: defaultNumberTypeMeta,
    boolean: defaultBooleanTypeMeta,
    date: undefined,
    email: defaultEmailTypeMeta,
    any: undefined,
    api: defaultApiTypeMeta,
    select: defaultSelectTypeMeta,
    multipleSelect: defaultSelectTypeMeta,
    url: undefined,
    ip: undefined,
    uuid: undefined,
    cuid: undefined,
    nanoId: undefined,
    json: undefined,
    calc: undefined,
    table: undefined,
    tableLookup: undefined,
    longText: undefined,
    image: undefined,
    file: undefined,
}
