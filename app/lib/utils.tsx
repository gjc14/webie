import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const isConventional = (
    fetcherData: unknown
): fetcherData is { data: any; msg: string; err: string } => {
    if (typeof fetcherData !== 'object' || fetcherData === null) return false
    if (
        !('data' in fetcherData) ||
        !('msg' in fetcherData) ||
        !('err' in fetcherData)
    )
        return false
    return true
}

export const isConventionalData = (
    fetcherData: unknown
): fetcherData is { data: any } => {
    if (typeof fetcherData !== 'object' || fetcherData === null) return false
    if (!('data' in fetcherData)) return false
    return true
}

export const isConventionalSuccess = (
    fetcherData: unknown
): fetcherData is { msg: string } => {
    if (typeof fetcherData !== 'object' || fetcherData === null) return false
    if (!('msg' in fetcherData)) return false
    return true
}

export const isConventionalError = (
    fetcherData: unknown
): fetcherData is { err: string } => {
    if (typeof fetcherData !== 'object' || fetcherData === null) return false
    if (!('err' in fetcherData)) return false
    return true
}
