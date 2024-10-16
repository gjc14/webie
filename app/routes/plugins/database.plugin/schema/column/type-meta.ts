import { z } from 'zod'
import { webieColType, zodTypeMap } from '../column'

// String
export const stringTypeMetaSchema = z.object({
    defaultValue: zodTypeMap.string.optional(),
})
export type StringTypeMeta = z.infer<typeof stringTypeMetaSchema>
const defaultStringTypeMeta: StringTypeMeta = {
    defaultValue: undefined,
}

// Number
export const numberTypes = [
    'integer',
    'decimal',
    'percentage',
    'currency',
] as const
export const numberTypeMetaSchema = z.object({
    defaultValue: zodTypeMap.number.optional(),
    type: z.enum(numberTypes).optional(),
})
export type NumberTypeMeta = z.infer<typeof numberTypeMetaSchema>
const defaultNumberTypeMeta: NumberTypeMeta = {
    defaultValue: undefined,
    type: undefined,
    // TODO: Implement functionality number types
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
    allowNewOptions: z.boolean().optional(),
    options: z.string(),
    defaultValue: z.string().optional(),
})
export type SelectTypeMeta = z.infer<typeof selectTypeMetaSchema>
const defaultSelectTypeMeta: SelectTypeMeta = {
    allowNewOptions: false,
    options: '',
    defaultValue: undefined,
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

// Url
export const urlTypeMetaSchema = z.object({
    defaultValue: zodTypeMap.url.optional(),
})
export type UrlTypeMeta = z.infer<typeof urlTypeMetaSchema>
const defaulUrlTypeMeta: UrlTypeMeta = {
    defaultValue: undefined,
}

// Ip
export const ipTypeMetaSchema = z.object({
    defaultValue: zodTypeMap.ip.optional(),
})
export type IpTypeMeta = z.infer<typeof ipTypeMetaSchema>
const defaultIpTypeMeta: IpTypeMeta = {
    defaultValue: undefined,
}

export const typeDefaultColumnMetaValueMap = {
    string: defaultStringTypeMeta,
    number: defaultNumberTypeMeta,
    boolean: defaultBooleanTypeMeta,
    date: undefined,
    email: defaultEmailTypeMeta,
    any: undefined,
    api: defaultApiTypeMeta,
    select: defaultSelectTypeMeta,
    multipleSelect: defaultSelectTypeMeta,
    url: defaulUrlTypeMeta,
    ip: defaultIpTypeMeta,
    uuid: undefined,
    cuid: undefined,
    nanoid: undefined,
    json: undefined,
    calc: undefined,
    table: undefined,
    tableLookup: undefined,
    longText: undefined,
    percentage: { ...defaultNumberTypeMeta, type: 'percentage' },
    image: undefined,
    file: undefined,
} as const

type TypeDefaultColumnMetaValueMap = typeof typeDefaultColumnMetaValueMap
export type TypeMetaFor<T extends webieColType> =
    TypeDefaultColumnMetaValueMap[T]
