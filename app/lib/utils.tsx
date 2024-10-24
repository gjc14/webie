import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const conventionalSuccessSchema = z.object({
    msg: z.string(),
    data: z.unknown().optional(),
    options: z
        .object({
            preventAlert: z.boolean().optional(),
        })
        .optional(),
})
export type ConventionalSuccess = z.infer<typeof conventionalSuccessSchema>

export const conventionalErrorSchema = z.object({
    err: z.string(),
    data: z.unknown().optional(),
    options: z
        .object({
            preventAlert: z.boolean().optional(),
        })
        .optional(),
})
export type ConventionalError = z.infer<typeof conventionalErrorSchema>
export type ConventionalActionResponse = ConventionalSuccess | ConventionalError

export const isConventionalSuccess = (
    fetcherData: unknown
): fetcherData is ConventionalSuccess => {
    if (typeof fetcherData !== 'object' || fetcherData === null) return false
    if (!('msg' in fetcherData)) return false
    return true
}

export const isConventionalError = (
    fetcherData: unknown
): fetcherData is ConventionalError => {
    if (typeof fetcherData !== 'object' || fetcherData === null) return false
    if (!('err' in fetcherData)) return false
    return true
}

export const capitalize = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

import { NavLink } from '@remix-run/react'
import { BreadcrumbItem, BreadcrumbSeparator } from '~/components/ui/breadcrumb'
import { z } from 'zod'

export const generateBreadcrumbs = (pathname: string) => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbItems = paths.reduce((acc: JSX.Element[], path, index) => {
        const link = `/${paths.slice(0, index + 1).join('/')}`
        acc.push(
            <BreadcrumbItem key={index} className="hidden md:block">
                <NavLink
                    to={link}
                    className={({ isActive }) =>
                        `${
                            isActive ? 'text-primary' : 'hover:text-primary'
                        } text-sm`
                    }
                    end
                >
                    {capitalize(path)}
                </NavLink>
            </BreadcrumbItem>
        )
        if (index < paths.length - 1) {
            acc.push(
                <BreadcrumbSeparator
                    key={`separator-${index}`}
                    className="hidden md:block size-3"
                />
            )
        }
        return acc
    }, [])

    return breadcrumbItems
}
