import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export type ConventionalSuccess = {
    msg: string
    data?: unknown
}
export type ConventionalError = {
    err: string
    data?: unknown
}
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

import { NavLink } from '@remix-run/react'
import { BreadcrumbItem, BreadcrumbSeparator } from '~/components/ui/breadcrumb'

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
                    {path.charAt(0).toUpperCase() + path.slice(1)}
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
