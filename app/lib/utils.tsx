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
